"use client"
import {useState, useRef, useEffect} from "react";
import {useNotification} from "@/context/notification-provider";
import AnimatedContent from "@/app/components/animated-content";
import MDInput from "@/app/components/md-input";
import MDButton from "@/app/components/md-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus, faUserMinus, faFileExport, faFileImport, faTable, faList} from "@fortawesome/free-solid-svg-icons";
import {OssImage} from "@/app/components/oss-midea";
import * as XLSX from 'xlsx';
import {api} from "@/api/instance";
import {BaseResponse, UserInfo} from "@/api/internal/model/static/base-resp";

interface Student {
    uid: string;
    avatar: string;
    name: string;
    grade: string;
    faculty: string;
    major: string;
    class: string;
    phone: string;
}

const pageSizeOptions = [10, 25, 50, 100];

export default function CourseManagerPage({
                                              params,
                                          }: {
    params: Promise<{ cid: string }>;
}) {
    const [cid, setCid] = useState("")
    const {showNotification} = useNotification();
    const [students, setStudents] = useState<Array<Student>>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
    const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
    const [filters, setFilters] = useState({
        grade: '',
        faculty: '',
        major: '',
        class: ''
    });
    const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newStudentUid, setNewStudentUid] = useState("");
    const [newFilters, setNewFilters] = useState({
        keyword: '',
        grade: '',
        faculty: '',
        major: '',
        class: ''
    });
    const [newStudentList, setNewStudentList] = useState<Array<UserInfo>>([])

    const toggleStudentDialog = () => {
        setShowAddStudentDialog(prev => !prev);
    };

    const filteredStudents = students.filter(student =>
        (student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.uid.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!filters.grade || student.grade === filters.grade) &&
        (!filters.faculty || student.faculty === filters.faculty) &&
        (!filters.major || student.major === filters.major) &&
        (!filters.class || student.class === filters.class)
    );

    const SearchGlobalStudent = async () => {
        const SearchRes = await api.teacherService.searchStudent({
            offset: 0,
            size: 20,
            keyword: newFilters.keyword,
            grade: newFilters.grade,
            major: newFilters.major,
            faculty: newFilters.faculty
        });
        if (SearchRes.base.code !== 200) {
            showNotification({
                title: "搜索学生失败",
                content: SearchRes.base.msg,
                type: "error"
            })
        } else {
            setNewStudentList(SearchRes.usersinfo)
        }

    }

    const totalPages = Math.ceil(filteredStudents.length / pageSize);

    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const fetchStudents = async () => {
        // const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
        //     uid: `U${String(i + 1).padStart(5, '0')}`,
        //     name: `学生${i + 1}`,
        //     avatar: "",
        //     grade: `${2021 + Math.floor(i / 20)}级`,
        //     faculty: ['信息学院', '理学院', '工学院'   , '文学院'][i % 4],
        //     major: ['计算机科学', '软件工程', '人工智能', '数据科学'][i % 4],
        //     class: `班级${(i % 10) + 1}`,
        //     phone: `138${String(Math.random()).substring(2, 10)}`,
        // }));

        const _cid = (await params).cid
        setCid(_cid)
        const res = await api.courseService.info({cid: _cid});
        if (res.base.code !== 200) {
            showNotification({
                title: "获取失败",
                content: res.base.msg,
                type: "error"
            });
            return
        }
        const students = res.membersinfo.map(stu => ({
            uid: stu.uid,
            avatar: stu.avatar,
            name: stu.name,
            grade: stu.grade,
            faculty: stu.faculty,
            major: stu.major,
            phone: stu.phone,
            class: stu.class
        } as Student));
        setStudents(students);
    }

    useEffect(() => {
        fetchStudents();
    }, [params])


    const toggleStudentSelection = (studentUid: string) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentUid)) {
                newSet.delete(studentUid);
            } else {
                newSet.add(studentUid);
            }
            return newSet;
        });
    };

    const removeSelectedStudents = () => {
        const deleteList = students.filter(student => selectedStudents.has(student.uid));

        const jobs: Array<Promise<{ base: BaseResponse }>> = [];
        deleteList.forEach(async (stu) => {
            const job = api.teacherService.handleCourseMember({
                cid: cid,
                uid: stu.uid,
                delete: true
            })
            jobs.push(job);
        });

        Promise.all(jobs).then(() => {
            showNotification({
                title: "移除成功",
                content: "已移除选中的学生",
                type: "success"
            });
        }).catch((err) => {
            showNotification({
                title: "移除失败",
                content: "移除选中的学生时发生错误" + err,
                type: "error"
            });
        })

        setStudents(prev => prev.filter(student => !selectedStudents.has(student.uid)));
        setSelectedStudents(new Set());

        const newTotalPages = Math.ceil((students.length - selectedStudents.size) / pageSize);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            setCurrentPage(1);
        }
    };

    const handleAddStudentConfirm = () => {
        if (newStudentUid.trim()) {
            addStudent(newStudentUid.trim());
            setNewStudentUid("");
            toggleStudentDialog();
        } else {
            showNotification({
                title: "输入错误",
                content: "请输入有效的学生UID",
                type: "info"
            });
        }
    };

    const addStudent = async (uid: string) => {
        const res = await api.teacherService.inviteStudent({cid: cid, sid: uid})
        if (res.base.code !== 200) {
            showNotification({
                title: "添加失败",
                content: res.base.msg,
                type: "error"
            });
            return
        }
        showNotification({
            title: "添加成功",
            content: "已添加新学生",
            type: "success"
        })
        setSelectedStudents(new Set())
        setStudents([])
        fetchStudents()
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, {type: 'array'});
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];


                const newStudents: Student[] = jsonData.map((row, index) => {

                    const uid = row.uid || row.UID || `IMPORT${String(students.length + index + 1).padStart(5, '0')}`;
                    const name = row.name || row.姓名 || '';
                    const grade = row.grade || row.年级 || '';
                    const faculty = row.faculty || row.学院 || '';
                    const major = row.major || row.专业 || '';
                    const classVal = row.class || row.班级 || '';
                    const phone = String(row.phone || row.电话 || '');
                    const avatar = row.avatar || '';

                    return {uid, name, avatar, grade, faculty, major, class: classVal, phone};
                }).filter(student => student.uid && student.name);

                const jobs: Array<Promise<{ base: BaseResponse }>> = [];
                newStudents.forEach((stu) => {
                    const job = api.teacherService.inviteStudent({cid: cid, sid: stu.uid})
                    jobs.push(job);
                });

                Promise.all(jobs).then(() => {
                    showNotification({
                        title: "添加成功",
                        content: "已添加新学生",
                        type: "success"
                    });
                })

                if (newStudents.length > 0) {
                    setStudents(prev => [...prev, ...newStudents]);
                    showNotification({
                        title: "导入成功",
                        content: `已导入 ${newStudents.length} 名学生`,
                        type: "success"
                    });


                } else {
                    showNotification({
                        title: "导入提示",
                        content: "未找到有效学生数据或格式不匹配 (需要 uid/UID 和 name/姓名 列)",
                        type: "info"
                    });
                }

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

            } catch (error) {
                console.error('导入失败:', error);
                showNotification({
                    title: "导入失败",
                    content: "文件处理出错，请检查文件格式或内容。",
                    type: "error"
                });

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.onerror = () => {
            console.error('文件读取失败');
            showNotification({
                title: "导入失败",
                content: "无法读取文件",
                type: "error"
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
        reader.readAsArrayBuffer(file);
    };

    const handleExport = () => {

        const dataToExport = selectedStudents.size > 0
            ? students.filter(s => selectedStudents.has(s.uid))
            : students;

        if (dataToExport.length === 0) {
            showNotification({
                title: "导出提示",
                content: "没有可导出的学生数据。",
                type: "info"
            });
            return;
        }

        const data = dataToExport.map(student => ({
            UID: student.uid,
            姓名: student.name,
            年级: student.grade,
            学院: student.faculty,
            专业: student.major,
            班级: student.class,
            电话: student.phone,

        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "学生名单");
        const exportFileName = selectedStudents.size > 0 ? "选中学生名单.xlsx" : "学生名单.xlsx";
        XLSX.writeFile(wb, exportFileName);
        showNotification({
            title: "导出成功",
            content: `已导出 ${data.length} 名学生到 ${exportFileName}`,
            type: "success"
        });
    };


    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1);
    };


    const startItem = filteredStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(currentPage * pageSize, filteredStudents.length);

    return (
        <div className="p-6 min-h-screen bg-surface relative">
            {showAddStudentDialog && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <AnimatedContent
                        distance={50}
                        reverse={true}
                        config={{tension: 80, friction: 20}}
                    >
                        <div className="bg-surface-container rounded-2xl p-6 shadow-xl  space-y-4">
                            <h3 className="text-xl font-semibold text-on-surface">搜索并添加学生</h3>
                            <div className={`flex w-full flex-row space-x-3`}>
                                <MDInput
                                    value={newFilters.grade}
                                    onValueChange={(value) => setNewFilters(prev => ({...prev, grade: value}))}
                                    placeholder="按年级筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={newFilters.faculty}
                                    onValueChange={(value) => setNewFilters(prev => ({...prev, faculty: value}))}
                                    placeholder="按学院筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={newFilters.major}
                                    onValueChange={(value) => setNewFilters(prev => ({...prev, major: value}))}
                                    placeholder="按专业筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={newFilters.class}
                                    onValueChange={(value) => setNewFilters(prev => ({...prev, class: value}))}
                                    placeholder="按班级筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                            </div>
                            <div className={`w-2/5`}>
                                <MDInput
                                    placeholder="学生姓名或完整uid"
                                    value={newFilters.keyword}
                                    onValueChange={(value) => setNewFilters(prev => ({...prev, keyword: value}))}
                                    onEnter={SearchGlobalStudent}
                                />
                            </div>
                            <div className={`w-full flex flex-col space-y-3 max-h-96 text-on-background overflow-auto`}>
                                <table className="w-full">
                                    <thead className="sticky top-0 z-10">
                                    <tr className="bg-surface-container border-b border-outline-variant">
                                        <th className="px-4 py-3 text-left w-12"></th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">头像</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">姓名</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">UID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">年级</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">学院</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">专业</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">班级</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {newStudentList?.map((item, index) => (
                                        <tr key={index} className="hover:bg-surface-container-hover transition-colors">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={students.some(student => student.uid === item.uid)}
                                                    className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-outline rounded cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={async (e) => {
                                                        if (students.some(student => student.uid === item.uid)) {
                                                            const res = await api.teacherService.handleCourseMember({
                                                                cid: cid,
                                                                uid: item.uid,
                                                                delete: true
                                                            });
                                                            if (res.base.code !== 200) {
                                                                showNotification({
                                                                    title: "移除学生失败",
                                                                    content: res.base.msg,
                                                                    type: "error"
                                                                })
                                                            } else {
                                                                await fetchStudents()
                                                            }
                                                        } else {
                                                            await addStudent(item.uid)
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <OssImage
                                                    className="w-16 aspect-square rounded-full"
                                                    url={item.avatar}
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.uid}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.grade}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.faculty}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.major}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{item.class}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <MDButton className={`w-24`} onClick={toggleStudentDialog}>返回</MDButton>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <AnimatedContent
                    distance={100}
                    reverse={false}
                    config={{tension: 80, friction: 20}}
                >
                    <div className="bg-surface-container rounded-3xl p-6 shadow-md">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <h1 className="text-3xl font-bold text-on-surface">课程成员管理</h1>
                            <div className="flex flex-wrap gap-3">
                                <MDButton
                                    onClick={toggleStudentDialog}
                                    className="bg-primary text-on-primary flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faUserPlus}/>
                                    添加学生
                                </MDButton>
                                <MDButton
                                    onClick={handleImport}
                                    className="bg-primary text-on-primary flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faFileImport}/>
                                    批量导入
                                </MDButton>
                                <MDButton
                                    onClick={handleExport}
                                    className="bg-primary text-on-primary flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faFileExport}/>
                                    {selectedStudents.size > 0 ? `导出选中(${selectedStudents.size})` : '导出名单'}
                                </MDButton>
                                <MDButton
                                    onClick={() => setViewMode(viewMode === 'list' ? 'table' : 'list')}
                                    className="bg-primary text-on-primary flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={viewMode === 'list' ? faTable : faList}/>
                                    {viewMode === 'list' ? '表格视图' : '列表视图'}
                                </MDButton>
                                {selectedStudents.size > 0 && (
                                    <MDButton
                                        onClick={removeSelectedStudents}
                                        className="bg-error-container text-on-error-container flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faUserMinus}/>
                                        移除选中 ({selectedStudents.size})
                                    </MDButton>
                                )}
                            </div>
                        </div>

                        <div className="mb-6 space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <MDInput
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                    placeholder="搜索学生姓名或UID"
                                    className="flex-grow min-w-[200px]"
                                />
                                <MDInput
                                    value={filters.grade}
                                    onValueChange={(value) => setFilters(prev => ({...prev, grade: value}))}
                                    placeholder="按年级筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={filters.faculty}
                                    onValueChange={(value) => setFilters(prev => ({...prev, faculty: value}))}
                                    placeholder="按学院筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={filters.major}
                                    onValueChange={(value) => setFilters(prev => ({...prev, major: value}))}
                                    placeholder="按专业筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                                <MDInput
                                    value={filters.class}
                                    onValueChange={(value) => setFilters(prev => ({...prev, class: value}))}
                                    placeholder="按班级筛选"
                                    className="w-full sm:w-32 md:w-40"
                                />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                        />

                        {viewMode === 'list' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedStudents.length > 0 ? paginatedStudents.map(student => (
                                    <div
                                        key={student.uid}
                                        className={`bg-surface-container-high rounded-xl p-4 shadow-sm border-2 ${selectedStudents.has(student.uid) ? 'border-primary ring-2 ring-primary' : 'border-outline-variant'} transition-all duration-200 cursor-pointer hover:shadow-md`}
                                        onClick={() => toggleStudentSelection(student.uid)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <OssImage
                                                url={student.avatar}
                                                alt="N/A"
                                                className="w-16 h-16 rounded-full object-cover flex-shrink-0 bg-surface-container-lowest"
                                            />
                                            <div className="flex-1 overflow-hidden">
                                                <h3 className="text-lg font-semibold text-on-surface truncate">{student.name}</h3>
                                                <p className="text-sm text-on-surface-variant truncate">UID: {student.uid}</p>
                                                <p className="text-sm text-on-surface-variant truncate"
                                                   title={`${student.grade} ${student.faculty} ${student.major} ${student.class}`}>{student.grade} {student.faculty} {student.major} {student.class}</p>
                                                <p className="text-sm text-on-surface-variant truncate">电话: {student.phone || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="col-span-full text-center text-on-surface-variant py-10">没有找到匹配的学生。</p>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border border-outline-variant">
                                <table className="min-w-full bg-surface-container-low">
                                    <thead className="sticky top-0 z-10">
                                    <tr className="bg-surface-container border-b border-outline-variant">
                                        <th className="px-4 py-3 text-left w-12">
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">头像</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">姓名</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">UID</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">年级</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">学院</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">专业</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">班级</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-on-surface-variant tracking-wider whitespace-nowrap">电话</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant">
                                    {paginatedStudents.length > 0 ? paginatedStudents.map(student => (
                                        <tr
                                            key={student.uid}
                                            className={`group hover:bg-surface-container-high ${selectedStudents.has(student.uid) ? 'bg-primary-container' : ''} transition-colors duration-150 cursor-pointer`}
                                            onClick={() => toggleStudentSelection(student.uid)}
                                        >
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.has(student.uid)}
                                                    readOnly
                                                    className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-outline rounded cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={() => toggleStudentSelection(student.uid)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                <OssImage
                                                    url={student.avatar}
                                                    alt={student.name}
                                                    className="w-10 h-10 rounded-full object-cover bg-surface-container-lowest"
                                                />
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface font-medium">{student.name}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.uid}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.grade}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.faculty}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.major}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.class}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-on-surface-variant">{student.phone || 'N/A'}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={9}
                                                className="text-center text-on-surface-variant py-10">没有找到匹配的学生。
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
                            <div className="flex items-center gap-2">
                                <label htmlFor="pageSizeSelect"
                                       className="text-sm text-on-surface-variant whitespace-nowrap">每页显示:</label>
                                <select
                                    id="pageSizeSelect"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="form-select block w-auto px-3 py-1.5 text-base font-normal text-on-surface bg-surface-container border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out m-0"
                                    aria-label="选择每页显示数量"
                                >
                                    {pageSizeOptions.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <span className="text-sm text-on-surface-variant">条</span>
                            </div>

                            <span className="text-sm text-on-surface-variant flex-shrink-0 order-last sm:order-none">
                                {filteredStudents.length > 0
                                    ? `显示 ${startItem} - ${endItem} 条，共 ${filteredStudents.length} 条`
                                    : '共 0 条'
                                }
                            </span>

                            {totalPages > 1 && (
                                <div className="flex gap-2 justify-center sm:justify-end flex-grow">
                                    <MDButton
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="bg-secondary-container text-on-secondary-container disabled:opacity-50"
                                    >
                                        上一页
                                    </MDButton>
                                    <span className="px-4 py-2 text-on-surface flex items-center">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <MDButton
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="bg-secondary-container text-on-secondary-container disabled:opacity-50"
                                    >
                                        下一页
                                    </MDButton>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedContent>
            </div>
        </div>
    );
}