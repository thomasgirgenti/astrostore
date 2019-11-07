import React, {useState, useEffect} from 'react';
import axios from 'axios/index';

import {Dropdown, TextField} from '../inputs/MaterialInputs';
import ChunkyButton from '../inputs/ChunkyButton';
import MenuItem from '@material-ui/core/MenuItem';

import './sharestyle.css';

const queryString = require('query-string');


function ShareBookmark(props) {

	const token = localStorage.getItem('token');

	const [title, setTitle] = useState(queryString.parse(props.location.search).title);
	const [url, setUrl] = useState(queryString.parse(props.location.search).text);
	const [dropItems, setDropItems] = useState([]);
	const [message, setMessage] = useState('');
	const [parentId, setParent] = useState('');


	useEffect(() => {
		axios.get('https://astrostore.io/api/collection/all', {
			headers: {Authorization: `JWT ${token}`}
		}).then(res => {

			let collections = res.data.collections.map((c) => ({id: c._id, title: c.title}));
			let order = res.data.order;
			let sortedCollections = [];

			for (let i = 0; i < order.length; i++) {
				const index = collections.findIndex(c => c._id === order[i]);
				if (index >= 0) {
					sortedCollections.push(collections[index]);
					collections.splice(index, 1);
				}
			}

			if (collections.length > 0) {
				for (let j = 0; j < collections.length; j++) {
					sortedCollections.push(collections[j]);
				}
			}

			setDropItems(sortedCollections);
		});
	}, [token]);


	const addBookmark = () => {
		axios.post('https://astrostore.io/api/bookmark/create',
			{title: title, url: url, parentId: parentId},
			{headers: {Authorization: `JWT ${token}`}})
			.then(res =>
				res.data.success
					? setMessage('Success!')
					: setMessage('Error Adding Bookmark :(')
			)
	};


	return (
		<div className='container'>
			<div className='modalHeader'>New Bookmark</div>
			<div className='modalMessage'>{message}</div>

			<div className='fieldWrapper'>
				<TextField
					label='Bookmark Title'
					placeholder=''
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<TextField
					label='Bookmark Url'
					placeholder=''
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>

				<Dropdown
					label='Collection'
					value={parentId}
					onChange={(e) => setParent(e.target.value)}
				>
					{
						dropItems.map(c =>
							<MenuItem value={c.id} key={c.id} >
								{c.title}
							</MenuItem>
						)
					}
				</Dropdown>
			</div>

			<div className='submitWrapper'>
				<ChunkyButton onPress={() => addBookmark()} text={'Submit'} type={'primary'} />
			</div>
		</div>
	);
}


export default ShareBookmark;