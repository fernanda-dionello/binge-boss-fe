import { useEffect, useState } from "react";
import { Banner } from "../../components/Banner/Banner";
import "./details.css";
import { useLocation } from "react-router-dom";
import Api from "../../services/Api";
import { ContentBasicInfo } from "../../components/ContentBasicInfo/ContentBasicInfo";
import { CastSlider } from "../../components/CastSlider/CastSlider";
import { ContentDetails } from "../../components/ContentDetails/ContentDetails";
import { Comments } from '../../components/Comments/Comments';

export function Details() {
  const { state } = useLocation();
  const [contentDetails, setContentDetails] = useState({});
  const {
    name,
    backdrop_path,
    title,
    id,
    media_type,
    contentName,
    contentId,
    contentType,
  } = state;

  useEffect(() => {
    const getContentDetails = async () => {
      await Api.get(`/content/${id || contentId}`, {
        params: {
          type: media_type || contentType,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      })
        .then((res) => setContentDetails(res.data))
        .catch((err) => console.log(err));
    };
    getContentDetails();
  }, []);

  useEffect(() => {
  }, [contentDetails]);

  return (
    <>
      <Banner
        title={name || title || contentName}
        image={
          backdrop_path
            ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
            : "../../assets/noImage.svg"
        }
      />
      <ContentBasicInfo
        id={id}
        contentId={contentId}
        channels={contentDetails?.networks}
        first_air_date={contentDetails?.first_air_date}
        last_air_date={contentDetails?.last_air_date}
        release_date={contentDetails?.release_date}
        media_type={media_type}
        contentType={contentType}
        genres={contentDetails?.genres}
        vote_average={contentDetails?.vote_average}
        overview={contentDetails?.overview}
      />
      {contentDetails?.credits?.cast.length > 0 && (
        <CastSlider content={contentDetails?.credits?.cast} />
      )}
      {media_type === "tv" || contentType === "tv" ? (
        <ContentDetails
          id={id}
          contentId={contentId}
          number_of_seasons={contentDetails?.number_of_seasons}
        />
      ) : (
        <div className='write-comment-movie'>
          <p className='write-a-comment'>Write a comment</p>
          <Comments
            id={id ?? contentId}
            type="movie"
          />
        </div>
      )}
    </>
  );
}
