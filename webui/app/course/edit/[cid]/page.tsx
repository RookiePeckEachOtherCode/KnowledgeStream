"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/notification-provider";
import AnimatedContent from "@/app/components/animated-content";
import MDInput from "@/app/components/md-input";
import MDButton from "@/app/components/md-button";
import { CourseDataVO, CourseSectionVO, fetchCourseData } from "../../vo";
import { api } from "@/api/instance";
import { BaseResponse } from "@/api/internal/model/static/base-resp";

export default function CourseEditPage({
    params,
}: {
    params: Promise<{ cid: string }>;
}) {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [courseData, setCourseData] = useState<CourseDataVO | null>(null);
    const [sections, setSections] = useState<Array<CourseSectionVO>>([]);
    const [deletedIds, setDeletedIds] = useState<Array<string>>([]);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const handleRename = async () => {
        if (!courseData) return;
        const cid = (await params).cid;

        const res = await api.teacherService.updateCourse({
            cid: cid,
            title: courseData.name,
            cover: "",
            description: "",
            begin_time: "",
            end_time: ""
        })

        if (res.base.code !== 200) {
            showNotification({
                title: "修改课程名称失败",
                content: res.base.msg,
                type: "error"
            });
            return;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const cid = (await params).cid;
            const res = await fetchCourseData(cid);
            if (res.base.code !== 200) {
                showNotification({
                    title: "获取课程数据失败",
                    content: res.base.msg,
                    type: "error"
                });
                return;
            }
            setCourseData(res.data);
            setSections(res.data.list);
        };

        fetchData();
    }, [params, showNotification]);

    const handleSave = async () => {
        if (!courseData) return;
        if (deletedIds.length <= 0) return

        showNotification({
            title: "删除视频",
            content: "正在删除视频，请稍等",
            type: "info"
        })

        const jobs: Array<Promise<{ base: BaseResponse }>> = [];

        deletedIds.forEach(id => {
            const res = api.teacherService.deleteVideo({ vid: id })
            jobs.push(res);
        });

        const res = await Promise.all(jobs);

        if (res.some(item => item.base.code !== 200)) {
            showNotification({
                title: "删除视频失败",
                content: "删除视频失败，请稍后重试",
                type: "error"
            });
            return;
        }

        showNotification({
            title: "删除视频成功",
            content: "删除视频成功",
            type: "success"
        });
    };

    const groupedSections = sections ? Object.entries(
        sections.reduce((acc, section) => {
            if (!acc[section.section_number]) {
                acc[section.section_number] = [];
            }
            acc[section.section_number].push(section);
            return acc;
        }, {} as Record<string, typeof sections>)
    ) : [];

    const removeSection = (sectionIndex: number) => {
        setDeletedIds(prev => [...prev, sections[sectionIndex].id]);
        setSections(prev => prev.filter((_, idx) => idx !== sectionIndex));
    };

    const cancelNameFocus = () => {
        setInterval(() => {
            setIsNameFocused(false);
        }, 400);
    }

    return (
        <div className="p-6 min-h-screen bg-surface">
            {courseData && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatedContent
                        distance={100}
                        reverse={false}
                        config={{ tension: 80, friction: 20 }}
                    >
                        <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                            <h1 className="text-3xl font-bold text-on-surface mb-6">编辑课程</h1>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-variant mb-2">课程名称</label>
                                    <MDInput
                                        value={courseData.name}
                                        onValueChange={(value) => setCourseData(prev => ({ ...prev!, name: value }))}
                                        placeholder="输入课程名称"
                                        onFocus={() => setIsNameFocused(true)}
                                        onBlur={() => cancelNameFocus()}
                                    />
                                    <div className="flex justify-end mt-2 transition-opacity duration-300" style={{ opacity: isNameFocused ? 1 : 0 }}>
                                        {isNameFocused && (
                                            <MDButton onClick={() => handleRename()}>修改</MDButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        reverse={false}
                        config={{ tension: 80, friction: 20 }}
                    >
                        <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-on-surface">课程章节</h2>
                            </div>

                            <div className="space-y-4">
                                {groupedSections.map(([sectionNumber, sectionItems], sectionIndex) => (
                                    <div key={sectionNumber} className="bg-surface-container-low p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-on-surface">{sectionNumber}</h3>
                                        </div>
                                        {sectionItems.map((section, itemIndex) => (
                                            <div key={section.id} className="mt-4 border-t border-outline/10 pt-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-sm font-medium text-on-surface-variant">小节 {itemIndex + 1}</h4>
                                                    <MDButton onClick={() => removeSection(sectionIndex)}>删除</MDButton>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-on-surface-variant mb-2">章节编号</label>
                                                        <MDInput
                                                            value={section.section_number}
                                                            disabled
                                                            placeholder="章节编号"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-on-surface-variant mb-2">章节名称</label>
                                                        <MDInput
                                                            value={section.section_name}
                                                            disabled
                                                            placeholder="章节名称"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </AnimatedContent>

                    <div className="flex justify-end space-x-4">
                        <MDButton onClick={() => router.back()}>取消</MDButton>
                        <MDButton onClick={handleSave}>保存</MDButton>
                    </div>
                </div>
            )}
        </div>
    );
}
