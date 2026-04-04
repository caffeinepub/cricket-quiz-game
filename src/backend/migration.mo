import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
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

  type UserProfile = {
    name : Text;
  };

  type User = {
    email : Text;
    passwordHash : Text;
  };

  type OldActor = {
    results : Map.Map<Text, Result>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    results : Map.Map<Text, Result>;
    userProfiles : Map.Map<Principal, UserProfile>;
    users : Map.Map<Principal, User>;
  };

  public func run(old : OldActor) : NewActor {
    { old with users = Map.empty<Principal, User>() };
  };
};
