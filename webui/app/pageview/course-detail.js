export function CourseDetail() {
    return (
        <div className={`w-full  h-full flex flex-col p-8`}>
            <div className={`text-3xl`}>Hi My Course</div>
            <iframe
                src={`https://www.doubao.com/`}
                className={`w-1/2 h-full`}
                allowFullScreen={true}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            >
            </iframe>
        </div>
    );
}
