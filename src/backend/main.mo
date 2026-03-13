import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Outcall "http-outcalls/outcall";

actor {
  type SubjectResult = {
    subjectName : Text;
    marksObtained : Nat;
    maxMarks : Nat;
  };

  type Result = {
    rollNumber : Text;
    studentName : Text;
    examName : Text;
    subjects : [SubjectResult];
    totalMarks : Nat;
    obtainedMarks : Nat;
    percentage : Float;
    grade : Text;
    passed : Bool;
    timestamp : Time.Time;
  };

  let results = Map.empty<Text, Result>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  func calculatePercentage(marks : Nat, total : Nat) : Float {
    if (total == 0) { 0.0 } else {
      marks.toFloat() / total.toFloat() * 100.0;
    };
  };

  func determineGrade(percentage : Float) : Text {
    if (percentage >= 90.0) {
      "A+";
    } else if (percentage >= 80.0) {
      "A";
    } else if (percentage >= 70.0) {
      "B+";
    } else if (percentage >= 60.0) {
      "B";
    } else if (percentage >= 50.0) {
      "C";
    } else {
      "F";
    };
  };

  func hasPassed(percentage : Float) : Bool {
    percentage >= 40.0;
  };

  // HTTP transform
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // Helper: extract value after a JSON key
  func extractJsonString(json : Text, key : Text) : ?Text {
    let marker = "\"" # key # "\":\"";
    let markerSpace = "\"" # key # "\": \"";
    // Try without space
    let parts = json.split(#text marker);
    ignore parts.next();
    switch (parts.next()) {
      case (?seg) {
        // unescape \n and grab until closing quote
        let ans = seg.split(#text "\"").next();
        switch (ans) {
          case (?a) { if (a.size() > 0) { return ?a } };
          case (null) {};
        };
      };
      case (null) {};
    };
    // Try with space
    let parts2 = json.split(#text markerSpace);
    ignore parts2.next();
    switch (parts2.next()) {
      case (?seg) {
        switch (seg.split(#text "\"").next()) {
          case (?a) { if (a.size() > 0) { return ?a } };
          case (null) {};
        };
      };
      case (null) {};
    };
    null;
  };

  // Gemini 1.5 Flash via RapidAPI
  public func askGemini(question : Text) : async Text {
    let rapidApiKey = "5a96739290mshfe8b07bc59dab09p1fb832jsnc8c462b28a25";
    let url = "https://gemini-1-5-flash.p.rapidapi.com/";
    let systemMsg = "You are Kuzo AI. Answer directly and briefly. For math give only the result. For capitals just say the city name. For facts give 1-2 sentences. If unknown say: I don't have enough information to answer this. Do not repeat the question.";
    let body = "{\"model\":\"gemini-1.5-flash\",\"messages\":[{\"role\":\"user\",\"content\":\"" # systemMsg # " Question: " # question # "\"}]}";
    try {
      let response = await Outcall.httpPostRequest(
        url,
        [
          { name = "Content-Type"; value = "application/json" },
          { name = "x-rapidapi-key"; value = rapidApiKey },
          { name = "x-rapidapi-host"; value = "gemini-1-5-flash.p.rapidapi.com" },
        ],
        body,
        transform,
      );
      // Try common response keys: "result", "content", "text", "response", "answer"
      let keys = ["result", "content", "text", "response", "answer"];
      var found : ?Text = null;
      for (k in keys.vals()) {
        if (found == null) {
          found := extractJsonString(response, k);
        };
      };
      switch (found) {
        case (?ans) { ans };
        case (null) {
          // Try to extract from choices[0].message.content pattern
          let choicesMarker = "\"content\":\"";
          let cp = response.split(#text choicesMarker);
          ignore cp.next();
          switch (cp.next()) {
            case (?seg) {
              switch (seg.split(#text "\"").next()) {
                case (?a) { if (a.size() > 0) { a } else { "I don't have enough information to answer this." } };
                case (null) { "I don't have enough information to answer this." };
              };
            };
            case (null) { "I don't have enough information to answer this." };
          };
        };
      };
    } catch (_e) {
      "I don't have enough information to answer this. Please try again.";
    };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getResultByRollNumber(rollNumber : Text) : async ?Result {
    results.get(rollNumber);
  };

  public shared ({ caller }) func addOrUpdateResult(result : Result) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let percentage = calculatePercentage(result.obtainedMarks, result.totalMarks);
    let grade = determineGrade(percentage);
    let passed = hasPassed(percentage);
    let enrichedResult = { result with percentage; grade; passed; timestamp = Time.now() };
    results.add(result.rollNumber, enrichedResult);
  };

  public shared ({ caller }) func deleteResult(rollNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    results.remove(rollNumber);
  };

  public query ({ caller }) func getAllResults(searchTerm : ?Text) : async [Result] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    var iter = results.values();
    switch (searchTerm) {
      case (?term) {
        iter := iter.filter(
          func(result) {
            result.studentName.contains(#text term) or result.rollNumber.contains(#text term)
          }
        );
      };
      case (null) {};
    };
    iter.toArray();
  };

  system func preupgrade() { };
  system func postupgrade() {
    let initialResults = [
      {
        rollNumber = "1001";
        studentName = "Alice Johnson";
        examName = "Midterm 2024";
        subjects = [
          { subjectName = "Math"; marksObtained = 85; maxMarks = 100 },
          { subjectName = "English"; marksObtained = 78; maxMarks = 100 },
          { subjectName = "Science"; marksObtained = 92; maxMarks = 100 },
        ];
        totalMarks = 300;
        obtainedMarks = 255;
        percentage = calculatePercentage(255, 300);
        grade = determineGrade(85.0);
        passed = hasPassed(85.0);
        timestamp = Time.now();
      },
      {
        rollNumber = "1002";
        studentName = "Bob Smith";
        examName = "Midterm 2024";
        subjects = [
          { subjectName = "Math"; marksObtained = 62; maxMarks = 100 },
          { subjectName = "English"; marksObtained = 55; maxMarks = 100 },
          { subjectName = "Science"; marksObtained = 70; maxMarks = 100 },
        ];
        totalMarks = 300;
        obtainedMarks = 187;
        percentage = calculatePercentage(187, 300);
        grade = determineGrade(62.33);
        passed = hasPassed(62.33);
        timestamp = Time.now();
      },
    ];
    for (result in initialResults.values()) {
      results.add(result.rollNumber, result);
    };
  };
};
