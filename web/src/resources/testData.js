export const meeting = {
	id: 1,
	title: 'App development best practices meeting',
	participants: [
		{
			id: 1,
			full_name: 'Mark Pare',
		},
		{
			id: 2,
			full_name: 'Kristian Larson',
		},
		{
			id: 3,
			full_name: 'Davy Risso',
		},
		{
			id: 4,
			full_name: 'Justin Almeida',
		},
	],
	status: 'active',
	created_on: '',
	started_on: '',
	ended_on: '',

	agenda: {
		items: [
			{
				id: 1, 
				title: 'Doc sharing protocol',
				text: 'What should we do to make doc sharing easy among group members?',
				status: 'open',
			},
			{
				id: 2, 
				title: 'Adding new members process',
				text: '',
				status: 'closed',
			},
			{
				id: 3, 
				title: 'Report backs',
				text: '',
				status: 'closed',
			},
		]
	},
	resources: [
		{
			id: 1, 
			title: 'Coop Bylaws',
			file_type: 'pdf',
			description: '',
			status: 'stable',
		},
		{
			id: 2, 
			title: 'How to make a thing',
			file_type: 'mp4',
			description: '',
			status: 'stable',
		},
		{
			id: 3, 
			title: 'Useful links',
			file_type: 'txt',
			description: '',
			status: 'stable',
		},
		{
			id: 4, 
			title: 'Another file name',
			file_type: 'link',
			description: '',
			status: 'stable',
		},
	],
	stack: {

	},
}


export const notifications = [
	{
		id: 0, text: 'You finished Meeting A at 3:50 today.'
	},
	{
		id: 1, text: 'Chris Edelson added a new topic to Meeting B.',
	},
	{
		id: 2, text: 'You added a file "Book about thing" to Meeting C',
	},
]