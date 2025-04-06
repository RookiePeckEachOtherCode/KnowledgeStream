export interface StudentFaculty {
    faculty: string;
    students: number;
    [property: string]: any;
}

export interface TeacherFaculty {
    faculty: string;
    teachers: number;
    [property: string]: any;
}
export interface VideoMajor {
    major: string;
    videos: number;
    [property: string]: any;
}

export interface VideoPlays {
    plays: number;
    /**
     * 视频名称
     */
    video: string;
    [property: string]: any;
}

