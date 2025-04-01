import React, { Component } from 'react';
import Hls from 'hls.js';

class Video extends Component {
	constructor(props) {
		super(props);
		this.state = {
			src: 'https://d2pecrlmcbhy9n.cloudfront.net/out/v1/d3726f5e04d543f4ac55784fbc5c66bc/index.m3u8'
		};
	}

	componentDidMount(){
		// Supports MediaSource API
		if(Hls.isSupported()) {
			var hls = new Hls();
			hls.loadSource(this.state.src);
			hls.attachMedia(this.player);
			hls.on(Hls.Events.MANIFEST_PARSED, (() => {
				this.player.play();
			}).bind(this));
		// Safari Mobile Detected
		} else if (this.player.canPlayType('application/vnd.apple.mpegurl')) {
			this.player.src = this.state.src;
			this.player.addEventListener('loadedmetadata', (() => {
				this.player.play();
			}).bind(this));
		}
	}

	render(){
		return(
			<div className="video-container">
				<video ref={(player) => this.player = player}></video>
			</div>
		);
	}
}

export default Video;