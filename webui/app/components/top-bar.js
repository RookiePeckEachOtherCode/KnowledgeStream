import MDInput from "./md-input.tsx";
import {useState} from "react";

export function TopBar(props) {
  const tepSrc =
    "https://tse3-mm.cn.bing.net/th/id/OIP-C.huUG6H4rNQYhb6yiOl9ZugHaHW?rs=1&pid=ImgDetMain";
  const [searchKeyword, setSearchKeyword] = useState('')

  return (
      <div
          className={`w-full flex flex-row h-1/10 justify-between  items-center pl-8 pr-8  justify-between transition-all bg-surface-container-high text-on-surface`}
      >
        <div className={`text-3xl`}>KnowledgeStream</div>
        <div className={`w-1/8 hover:w-1/3 transition-all duration-300`}>
          <MDInput
              value={searchKeyword}
              onValueChange={e => setSearchKeyword(e)}
              placeholder={`搜索课程`}
          ></MDInput>
        </div>
        <img
            className={`h-3/4 aspect-square rounded-full`}
            src={tepSrc}
            alt={`img`}
        />
      </div>
  );
}
 