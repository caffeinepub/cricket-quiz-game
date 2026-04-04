import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SubjectResult {
    subjectName: string;
    marksObtained: bigint;
    maxMarks: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Result {
    totalMarks: bigint;
    studentName: string;
    subjects: Array<SubjectResult>;
    grade: string;
    rollNumber: string;
    timestamp: Time;
    obtainedMarks: bigint;
    examName: string;
    percentage: number;
    passed: boolean;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UserInfo {
    principal: Principal;
    email: string;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateResult(result: Result): Promise<void>;
    askGemini(question: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteResult(rollNumber: string): Promise<void>;
    getAllResults(searchTerm: string | null): Promise<Array<Result>>;
    getAllUsers(): Promise<Array<UserInfo>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyEmail(): Promise<string | null>;
    getResultByRollNumber(rollNumber: string): Promise<Result | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, passwordHash: string): Promise<boolean>;
    registerUser(email: string, passwordHash: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
