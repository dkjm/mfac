import React, {Component} from 'react'
import './ResourceCard.css'
import CheckIcon from 'material-ui/svg-icons/navigation/check'
import {COLORS} from '../constants';

import LinkIcon from 'material-ui/svg-icons/content/link'
import VideoIcon from 'material-ui/svg-icons/av/featured-video'
import MediaIcon from 'material-ui/svg-icons/action/perm-media'


const fileTypes = {
	pdf: 'pdf',
	mp4: 'mp4',
	txt: 'txt',
	link: 'link',
}



const makeIcon = (fileType) => {
	if (fileType === fileTypes.link) {
		return <LinkIcon />
	}
	else if (fileType === fileTypes.mp4) {
		return <VideoIcon />
	}
	else {
		return <MediaIcon />
	}
}


class ResourceCard extends Component {


  render() {
		const r = this.props.resource;
		const icon = makeIcon(r.file_type);

		return (
			<div onClick={this.props.onClick} className="ResourceCard-container" key={r.id}>

				<div className="ResourceCard-top-container">
					<div className="ResourceCard-title">
						{r.title}
					</div>

					<div className="ResourceCard-status-container">
						{icon}
					</div>
				</div>

				<div className="ResourceCard-text">
					{r.description}
				</div>

			</div>
		)
	}
}


const styles = {
	container: {
		padding: '10px',
		textAlign: 'left',
		display: 'flex',
		minHeight: '30px',
	},
	title: {
		//flexGrow: '2',
		width: '90%',
	},
	statusContainer: {
		//flexGrow: '1',
		width: '10%',
	},
	check: {

	}
}


export default ResourceCard;