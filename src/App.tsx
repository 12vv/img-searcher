import { useEffect, useState } from "react";
import { Input } from "antd";
import axios from "axios";

const { Search } = Input;
import "./App.css";

interface ImageData {
  id: string;
  owner: "28017113@N08";
  secret: "8983a8ebc7";
  server: "578";
  farm: 1;
  title: "Merry Christmas!";
  ispublic: 1;
  isfriend: 0;
  isfamily: 0;
}

function App() {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [imgData, setImgData] = useState<Array<ImageData>>();

  useEffect(() => {}, []);

  const handleSubmit = (value: string) => {
    getImgData(value);
  };

  const getImgData = async (keywords: string) => {
    setBtnLoading(true);
    try {
      const res = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3e7cc266ae2b0e0d78e279ce8e361736&format=json&nojsoncallback=1&safe_search=1&text=${keywords}`
      );
      setImgData(res?.data?.photos?.photo);
      console.log(res);
      setBtnLoading(false);
    } catch (e) {
      console.log(e);
      setBtnLoading(false);
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
          {imgData?.photo?.length}
          {imgData?.map((item: ImageData) => {
            return (
              <>
                <img
                  className="img"
                  key={item.id}
                  src={`http://farm${item.farm}.static.flickr.com/${item.server}/${item.id}_${item.secret}.jpg
`}
                ></img>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
