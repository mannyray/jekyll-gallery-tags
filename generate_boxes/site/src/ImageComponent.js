import React, { useState, useEffect} from 'react';
import Draggable from 'react-draggable';
import {TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ImageComponent({height,width,path,pinFunction,color,url_backend}){
	const [dragState, setDragState] = useState({activeDrags: 0, deltaPosition: { x: 0, y: 0 }, controlledPosition: {x: -400, y: 200  }})
	const onStart = () => { setDragState({activeDrags: ++dragState.activeDrags});};
	const onStop = () => { setDragState({activeDrags: --dragState.activeDrags});};
	const dragHandlers = {onStart: onStart, onStop: onStop};

	const [tagButtons, setTagButtons] = useState([]);
	const [title, setTitle] = useState('');
	const [visibilityStatus, setVisibilityStatus] = useState(['visible','nonce']);


	function close(name){
		setVisibilityStatus(['hidden','none']);
	}

	function pin(){
		pinFunction(path);
	}

	function onLoadedTags( data ){
		var buttons = [];
		var foundCode = false;
		for(var i=0; i<data.length; i++){
			if( data[i].length > 4 && data[i].substring(0,4) === 'code' ){
				setTitle(data[i]);
				foundCode = true;
			}
			else{
				buttons.push(<button class="button">{data[i]}</button>);
			}
		}
		buttons.push(<button class="button">{path}</button>);
		setTagButtons(buttons);
		if(foundCode===true){
			return;
		}
		setTitle('unknown');
	}

	useEffect( () => {
		fetch(url_backend+'/get_specific_tags?path='+path).then(res => res.json()).then(res => onLoadedTags(res));
	}, []);

	return(
		<div>
			<Draggable {...dragHandlers}>
				<div style={{border:'5px solid black', backgroundColor:color, width:width*0.2, visibility:visibilityStatus[0], display:visibilityStatus[1] }}>
					<details>
						<summary>
							{title}
							<div style={{display:'flex'}}>
								<div>
									{tagButtons}
								</div>
								<div style={{marginLeft:'auto',marginRight:0}}>
									<button onClick={close}>X</button>
									<button onClick={pin}>PIN</button>
								</div>
							</div>
						</summary>
						<TransformWrapper>
							<TransformComponent>
								<img alt='zoomable' src={ url_backend + '/get_specific_image?path=' + path.split('/')[0] + '&image='+path.split('/')[1]} style={{width:width*0.196}}/>
							</TransformComponent>
						</TransformWrapper>
					</details>
				</div>
			</Draggable>
		</div>
	)
}
