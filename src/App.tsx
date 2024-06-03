import { useEffect, useState } from "react";
import { Input, Spin } from "antd";
import axios from "axios";
import { throttle } from "lodash";

const { Search } = Input;
import "./App.css";

interface ImageData {
  id: string;
  owner: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  ispublic: number;
  isfriend: number;
  isfamily: number;
}

function App() {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [imgData, setImgData] = useState<ImageData[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>("");
  const [load, setLoad] = useState<boolean>(false);

  const isTouchBottom = (handler: () => void) => {
    // 文档显示区域高度
    const showHeight = window.innerHeight;
    // 网页卷曲高度
    const scrollTopHeight =
      document.body.scrollTop || document.documentElement.scrollTop;
    // 所有内容高度
    const allHeight = document.body.scrollHeight;
    // (所有内容高度 = 文档显示区域高度 + 网页卷曲高度) 时即为触底
    if (allHeight <= showHeight + scrollTopHeight) {
      handler();
    }
  };

  useEffect(() => {
    getImgData(keyword, pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    window.addEventListener("scroll", useFn);
    return () => {
      window.removeEventListener("scroll", useFn);
    };
  }, []);

  const useFn = throttle(() => {
    isTouchBottom(() => {
      setPageIndex((pageIndex) => pageIndex + 1);
    });
  }, 2000);

  const handleSubmit = (value: string) => {
    if (!value) return;
    setKeyword(value);
    getImgData(value, pageIndex);
  };

  const getImgData = async (keywords: string, page: number = 0) => {
    if (load) return;
    setLoad(true);
    setBtnLoading(true);
    try {
      const res = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=${keywords}&page=${
          page + 1
        }&per_page=${10}`
      ); // 太多了，每一页请求10个便于观察
      if (res?.data) {
        const newPhotos = res?.data?.photos?.photo;
        if (newPhotos?.length > 0) {
          setImgData((imgData) => [...imgData, ...newPhotos]);
        }
      }
      setBtnLoading(false);
      setLoad(false);
    } catch (e) {
      console.log(e);
      setBtnLoading(false);
      setLoad(false);
    }
  };

  return (
    <>
      <div>
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          loading={btnLoading}
          onSearch={handleSubmit}
        />

        <div className="img-wrapper">
          {imgData?.map((item: ImageData) => {
            return (
              item.id && (
                <img
                  className="img"
                  key={item.id}
                  src={`http://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}.jpg
`}
                ></img>
              )
            );
          })}
          <Spin size="large" spinning={load} />
        </div>
      </div>
    </>
  );
}

export default App;
