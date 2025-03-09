export function TopBar(props) {
  const tepSrc =
    "https://tse3-mm.cn.bing.net/th/id/OIP-C.huUG6H4rNQYhb6yiOl9ZugHaHW?rs=1&pid=ImgDetMain";

  return (
    <div
      className={`w-full flex flex-row h-1/12 items-center pl-8 pr-8 justify-between transition-all bg-surface-container-high text-on-surface`}
    >
      <div className={`text-3xl`}>KnowledgeStram</div>
      <img
        className={`h-3/4 aspect-square rounded-full`}
        src={tepSrc}
        alt={`img`}
      />
    </div>
  );
}
