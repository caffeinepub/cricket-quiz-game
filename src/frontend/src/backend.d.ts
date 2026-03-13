import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubjectResult {
    subjectName: string;
    marksObtained: bigint;
    maxMarks: bigint;
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
export interface UserProfile {
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
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getResultByRollNumber(rollNumber: string): Promise<Result | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
