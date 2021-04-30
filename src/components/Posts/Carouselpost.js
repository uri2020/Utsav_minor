import React, { useState } from 'react';
// import { useHistory } from 'react-router';
import classes from './styles/carouselpost.module.css';
import Modal from '@material-ui/core/Modal';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import CancelIcon from '@material-ui/icons/Cancel';

const Carousel = ({ img, video, postId, full, openPost }) => {

    const [open, setOpen] = useState(false);
    const [viewImage, setViewImage] = useState('');

    function viewPost() {
        if (!full)
            openPost();
    }

    function viewFullImage(imgsrc) {
        setViewImage(imgsrc);
        setOpen(true);
    }

    const ListItem = (props) => {
        return (
            <div className={props.position === 0 ? "carousel-item active" : "carousel-item"}>
                {full ?
                    <img className={classes.imgFull} src={props.imgsrc} alt={props.position} onClick={() => viewFullImage(props.imgsrc)} />
                    :
                    <img className={classes.img} src={props.imgsrc} alt={props.position} onClick={viewPost} />
                }
            </div>
        );
    }

    const CarouselItem = (cvalue, index) => {
        return (
            <ListItem key={index.toString()} imgsrc={cvalue} position={index} />
        );
    }

    const Indicator = (props) => {
        return (
            <li
                className={props.active ? "active" : ""}
                data-target={"#slider" + postId}
                data-slide-to={props.index}>
            </li>
        );
    }

    const CarouselIndicators = (cvalue, index) => {
        return (
            <Indicator key={index.toString()} index={index} active={index === 0 ? true : false} />
        );
    }

    const FullscreenViewHandler = () => {

        return (
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div className={classes.fullViewContainer}>
                    <CancelIcon className={classes.closeFullView} onClick={() => setOpen(false)} />
                    <TransformWrapper defaultScale={1} defaultPositionX={1} defaultPositionY={1} >
                        {({ zoomIn, zoomOut, ...rest }) => (
                            <>
                                <TransformComponent>
                                    <img src={viewImage} alt="fullviewImage" className={classes.fullViewImg} />
                                </TransformComponent>
                                <div className={classes.fullViewButtons}>
                                    <span onClick={zoomIn} style={{ cursor: "pointer", color: 'white', marginRight: '15px' }}>
                                        <ZoomInIcon fontSize="large" /><small>ZoomIn</small>
                                    </span>
                                    <span onClick={zoomOut} style={{ color: 'white', cursor: "pointer" }}>
                                        <ZoomOutIcon fontSize="large" /> <small>ZoomOut</small>
                                    </span>
                                </div>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            </Modal>
        );

    }


    const carousel_data = img;

    if (carousel_data !== '') {

        if (carousel_data.length === 1) {
            return (
                <>
                    {full ? <img src={img[0]} style={{ cursor: 'pointer' }} alt="post_image" className="post__image" onClick={() => viewFullImage(img[0])} />
                        :
                        <img src={img[0]} alt="post_image" className="post__image" onClick={viewPost} />}
                    <FullscreenViewHandler />
                </>
            );
        }
        else if (carousel_data.length > 1) {
            return (
                <div className="carousel slide" id={"slider" + postId} data-ride="carousel" data-interval="5000" data-pause="hover">
                    <div className={"carousel-inner " + classes.carousel_inner}>
                        {carousel_data.map(CarouselItem)}
                    </div>

                    <ol className={"carousel-indicators " + classes.indicators}>
                        {carousel_data.map(CarouselIndicators)}
                    </ol>

                    <a href={"#slider" + postId} data-slide="prev" className="carousel-control-prev">
                        <span className="carousel-control-prev-icon" style={{ backgroundColor: 'black' }}></span>
                    </a>
                    <a href={"#slider" + postId} data-slide="next" className="carousel-control-next">
                        <span className="carousel-control-next-icon" style={{ backgroundColor: 'black' }}></span>
                    </a>
                    <FullscreenViewHandler />
                </div>
            );
        }
        else {
            return '';
        }
    }
    if (video !== '') {
        return (
            <video style={{ width: '100%', maxWidth: '600px' }} controls autoPlay muted>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    }
}

export default Carousel;
