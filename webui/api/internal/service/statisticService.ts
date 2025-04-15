import {Executor} from "@/api/internal/executor";
import {StatisticServiceRequest} from "@/api/internal/model/request/statistic";
import {StatisticServiceResponse} from "@/api/internal/model/response/statistic";

export class StatisticService {
    constructor(private executor: Executor) {
    }

    async studentFaculty(
        req: StatisticServiceRequest["FACULTY_STUDENTS"]
    ): Promise<StatisticServiceResponse["FACULTY_STUDENTS"]> {
        return this.executor({
            uri: "/statistics/faculty-student",
            method: "GET",
            body: null,
            query: req
        }) as Promise<StatisticServiceResponse["FACULTY_STUDENTS"]>
    }

    async teacherFaculty(
        req: StatisticServiceRequest["FACULTY_TEACHER"]
    ): Promise<StatisticServiceResponse["FACULTY_TEACHER"]> {
        return this.executor({
            uri: "/statistics/faculty-teacher",
            method: "GET",
            body: null,
            query: req
        }) as Promise<StatisticServiceResponse["FACULTY_TEACHER"]>
    }

    async videoMajor(
        req: StatisticServiceRequest["VIDEO_MAJOR"]
    ): Promise<StatisticServiceResponse["VIDEO_MAJOR"]> {
        return this.executor({
            uri: "/statistics/video-major",
            method: "GET",
            body: null,
            query: req
        }) as Promise<StatisticServiceResponse["VIDEO_MAJOR"]>
    }

    async videoPlays(
        req: StatisticServiceRequest["VIDEO_PLAYS"]
    ): Promise<StatisticServiceResponse["VIDEO_PLAYS"]> {
        return this.executor({
            uri: "/statistics/video-plays",
            method: "GET",
            body: null,
            query: req
        }) as Promise<StatisticServiceResponse["VIDEO_PLAYS"]>
    }


}