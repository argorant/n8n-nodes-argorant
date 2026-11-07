import type { IDataObject, INodeProperties, INodePropertyOptions } from 'n8n-workflow';

const names = (values: string[]): INodePropertyOptions[] => values.map((value) => ({ name: value, value }));

export const SENIORITY = names([
	'C-Level',
	'Director',
	'Entry',
	'Founder',
	'Intern',
	'Manager',
	'Owner',
	'Partner',
	'Senior',
	'VP',
]);

export const DEPARTMENTS = names([
	'Customer Success',
	'Data',
	'Design',
	'Engineering',
	'Executive',
	'Finance',
	'Human Resources',
	'IT',
	'Legal',
	'Marketing',
	'Operations',
	'Product',
	'Research',
	'Sales',
]);

export const EMPLOYEE_RANGES: INodePropertyOptions[] = [
	{ name: '1-10', value: '1-10' },
	{ name: '11-50', value: '11-50' },
	{ name: '51-200', value: '51-200' },
	{ name: '201-500', value: '201-500' },
	{ name: '501-1,000', value: '501-1000' },
	{ name: '1,001-5,000', value: '1001-5000' },
	{ name: '5,001-10,000', value: '5001-10000' },
	{ name: '10,000+', value: '10000+' },
];

export const REVENUE_BANDS: INodePropertyOptions[] = [
	{ name: 'Under $1M', value: '0-1m' },
	{ name: '$1M-$10M', value: '1m-10m' },
	{ name: '$10M-$50M', value: '10m-50m' },
	{ name: '$50M-$100M', value: '50m-100m' },
	{ name: '$100M-$250M', value: '100m-250m' },
	{ name: '$250M-$500M', value: '250m-500m' },
	{ name: '$500M-$1B', value: '500m-1b' },
	{ name: '$1B-$10B', value: '1b-10b' },
	{ name: '$10B+', value: '10b+' },
];

/** Regions the search understands besides countries. */
export const REGIONS = ['Africa', 'APAC', 'DACH', 'Europe', 'LATAM', 'Middle East', 'Nordics', 'North America'];

type Join = ',' | '|';

/** One filter: its n8n field (id, label, help, kind) and the API key it fills. */
interface FilterDef {
	id: string;
	key: string;
	label: string;
	help: string;
	kind: 'string' | 'multiOptions' | 'boolean' | 'number' | 'options';
	placeholder?: string;
	options?: INodePropertyOptions[];
	loadOptionsMethod?: string;
	join?: Join;
	initial?: string | number | boolean;
}

const PEOPLE: FilterDef[] = [
	{
		id: 'businessEmailOnly',
		key: 'business_email_only',
		label: 'Business Email Only',
		kind: 'boolean',
		help: "Whether to keep only people whose email is at their company's own domain",
	},
	{
		id: 'city',
		key: 'city',
		label: 'Cities',
		kind: 'string',
		placeholder: 'e.g. Munich, Austin',
		help: 'Cities, separated by commas',
	},
	{
		id: 'companyDomain',
		key: 'company_domain',
		label: 'Company Domains',
		kind: 'string',
		placeholder: 'e.g. example.com',
		help: 'Company website domains, separated by commas',
	},
	{
		id: 'companyName',
		key: 'company_name',
		label: 'Company Names',
		kind: 'string',
		placeholder: 'e.g. Linfield',
		help: 'Company names as written. Separate several names with |.',
	},
	{
		id: 'country',
		key: 'country',
		label: 'Country or Region Names or IDs',
		kind: 'multiOptions',
		loadOptionsMethod: 'getCountries',
		join: ',',
		help:
			'Countries or regions such as Europe, DACH or LATAM. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		id: 'departments',
		key: 'departments',
		label: 'Departments',
		kind: 'multiOptions',
		options: DEPARTMENTS,
		join: ',',
		help: 'Departments to include',
	},
	{
		id: 'employeeRange',
		key: 'employee_range',
		label: 'Company Sizes',
		kind: 'multiOptions',
		options: EMPLOYEE_RANGES,
		join: ',',
		help: 'Employee ranges to include',
	},
	{
		id: 'employeesMax',
		key: 'employees_max',
		label: 'Employees At Most',
		kind: 'string',
		placeholder: 'e.g. 500 or 1k',
		help: 'Largest number of employees. A company counts when its size range overlaps.',
	},
	{
		id: 'employeesMin',
		key: 'employees_min',
		label: 'Employees At Least',
		kind: 'string',
		placeholder: 'e.g. 50',
		help: 'Smallest number of employees. A company counts when its size range overlaps.',
	},
	{
		id: 'excludeAssistants',
		key: 'exclude_assistants',
		label: 'Leave Out Assistants',
		kind: 'boolean',
		initial: true,
		help: 'Whether a job title search leaves out assistant titles such as executive assistant',
	},
	{
		id: 'excludeCompanyDomain',
		key: 'exclude_company_domain',
		label: 'Exclude Company Domains',
		kind: 'string',
		placeholder: 'e.g. example.com',
		help: 'Leave out people at these company domains, separated by commas',
	},
	{
		id: 'excludeCountry',
		key: 'exclude_country',
		label: 'Exclude Country or Region Names or IDs',
		kind: 'multiOptions',
		loadOptionsMethod: 'getCountries',
		join: ',',
		help:
			'Leave out these countries or regions. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		id: 'excludeDepartments',
		key: 'exclude_departments',
		label: 'Exclude Departments',
		kind: 'multiOptions',
		options: DEPARTMENTS,
		join: ',',
		help: 'Departments to leave out',
	},
	{
		id: 'excludeIndustries',
		key: 'exclude_industries',
		label: 'Exclude Industry Names or IDs',
		kind: 'multiOptions',
		loadOptionsMethod: 'getIndustries',
		join: '|',
		help:
			'Industries to leave out. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		id: 'excludeKeywords',
		key: 'exclude_keywords',
		label: 'Exclude Keywords',
		kind: 'string',
		placeholder: 'e.g. agency, reseller',
		help: 'Leave out companies these words would find, separated by commas',
	},
	{
		id: 'excludeSeniority',
		key: 'exclude_seniority',
		label: 'Exclude Seniority',
		kind: 'multiOptions',
		options: SENIORITY,
		join: ',',
		help: 'Seniority levels to leave out',
	},
	{
		id: 'excludeTitle',
		key: 'exclude_title',
		label: 'Exclude Job Titles',
		kind: 'string',
		placeholder: 'e.g. intern, assistant',
		help: 'Leave out people with these job titles, separated by commas',
	},
	{
		id: 'foundedMax',
		key: 'founded_max',
		label: 'Founded In or Before',
		kind: 'number',
		initial: 2020,
		help: 'Companies founded in this year or earlier',
	},
	{
		id: 'foundedMin',
		key: 'founded_min',
		label: 'Founded In or After',
		kind: 'number',
		initial: 2015,
		help: 'Companies founded in this year or later. Companies with no known year are left out.',
	},
	{
		id: 'hasLinkedin',
		key: 'has_linkedin',
		label: 'Has Profile URL',
		kind: 'boolean',
		help: 'Whether to keep only people with a profile URL on record',
	},
	{
		id: 'hasPhone',
		key: 'has_phone',
		label: 'Has Phone Number',
		kind: 'boolean',
		help: 'Whether to keep only people with a phone number on record',
	},
	{
		id: 'industries',
		key: 'industries',
		label: 'Industry Names or IDs',
		kind: 'multiOptions',
		loadOptionsMethod: 'getIndustries',
		join: '|',
		help:
			'Exact industries. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		id: 'industry',
		key: 'industry',
		label: 'Industry in Plain Words',
		kind: 'string',
		placeholder: 'e.g. dental clinics',
		help: 'One industry in your own words, when no exact industry fits',
	},
	{
		id: 'keywords',
		key: 'keywords',
		label: 'Keywords',
		kind: 'string',
		placeholder: 'e.g. solar, freight forwarding',
		help: 'Words that describe what the company does, separated by commas',
	},
	{
		id: 'keywordScope',
		key: 'keyword_scope',
		label: 'Keywords Match',
		kind: 'options',
		initial: 'company',
		options: [
			{ name: 'What the Company Does', value: 'company' },
			{ name: "People's Own Skills", value: 'people' },
			{ name: 'Both', value: 'any' },
		],
		help: 'Where keywords look',
	},
	{
		id: 'nearPlace',
		key: 'near_place',
		label: 'Near Place',
		kind: 'string',
		placeholder: 'e.g. Denver, Colorado',
		help: 'A city or postal code. Use it with Radius.',
	},
	{
		id: 'q',
		key: 'q',
		label: 'Search Text',
		kind: 'string',
		placeholder: 'e.g. head of growth at fintech startups',
		help: 'Plain text across name, title, company and description',
	},
	{
		id: 'radius',
		key: 'radius',
		label: 'Radius',
		kind: 'number',
		initial: 25,
		help: 'Distance around Near Place, 0.5 to 500',
	},
	{
		id: 'radiusUnit',
		key: 'radius_unit',
		label: 'Radius Unit',
		kind: 'options',
		initial: 'mi',
		options: [
			{ name: 'Miles', value: 'mi' },
			{ name: 'Kilometers', value: 'km' },
		],
		help: 'Unit of Radius',
	},
	{
		id: 'revenueBand',
		key: 'revenue_band',
		label: 'Yearly Revenue',
		kind: 'multiOptions',
		options: REVENUE_BANDS,
		join: ',',
		help: 'Yearly company revenue in US dollars',
	},
	{
		id: 'sellsTo',
		key: 'sells_to',
		label: 'Sells To',
		kind: 'string',
		placeholder: 'e.g. restaurants',
		help: 'Who the company sells to',
	},
	{
		id: 'seniority',
		key: 'seniority',
		label: 'Seniority',
		kind: 'multiOptions',
		options: SENIORITY,
		join: ',',
		help: 'Seniority levels to include',
	},
	{
		id: 'state',
		key: 'state',
		label: 'States',
		kind: 'string',
		placeholder: 'e.g. Bavaria, TX',
		help: 'States or provinces by name or code, separated by commas',
	},
	{
		id: 'technologies',
		key: 'technologies',
		label: 'Technologies',
		kind: 'string',
		help: 'Technologies the company uses, as Argorant names them. Separate several with |.',
	},
	{
		id: 'title',
		key: 'title',
		label: 'Job Titles',
		kind: 'string',
		placeholder: 'e.g. CFO, VP Finance',
		help: 'Job titles, separated by commas. CFO also finds Chief Financial Officer.',
	},
	{
		id: 'titleMatch',
		key: 'title_match',
		label: 'Job Title Match',
		kind: 'options',
		initial: 'words',
		options: [
			{ name: 'Whole Words', value: 'words' },
			{ name: 'Exact Title', value: 'exact' },
			{ name: 'Contains the Text', value: 'contains' },
		],
		help: 'How job titles match',
	},
];

const COMPANY_KEYS = new Set([
	'city',
	'companyDomain',
	'companyName',
	'country',
	'employeeRange',
	'excludeCompanyDomain',
	'excludeCountry',
	'excludeIndustries',
	'excludeKeywords',
	'foundedMax',
	'foundedMin',
	'industries',
	'industry',
	'keywords',
	'nearPlace',
	'q',
	'radius',
	'radiusUnit',
	'revenueBand',
	'state',
	'technologies',
]);

const COMPANY: FilterDef[] = PEOPLE.filter((def) => COMPANY_KEYS.has(def.id)).map((def) =>
	def.id === 'q' ? { ...def, help: 'Plain text across company name and description' } : def,
);

function toProperty(def: FilterDef): INodeProperties {
	const base = {
		displayName: def.label,
		name: def.id,
		description: def.help,
	};
	switch (def.kind) {
		case 'boolean':
			return { ...base, type: 'boolean', default: def.initial ?? false };
		case 'number':
			return { ...base, type: 'number', default: def.initial ?? 0 };
		case 'options':
			return { ...base, type: 'options', options: def.options ?? [], default: def.initial ?? '' };
		case 'multiOptions':
			return def.loadOptionsMethod
				? {
						...base,
						type: 'multiOptions',
						typeOptions: { loadOptionsMethod: def.loadOptionsMethod },
						default: [],
					}
				: { ...base, type: 'multiOptions', options: def.options ?? [], default: [] };
		default:
			return { ...base, type: 'string', default: '', placeholder: def.placeholder };
	}
}

export function peopleFilterOptions(): INodeProperties[] {
	return PEOPLE.map(toProperty);
}

export function companyFilterOptions(): INodeProperties[] {
	return COMPANY.map(toProperty);
}

/** Turns the n8n filter collection into the API's filter keys. Empty values are left out. */
function build(values: IDataObject, defs: FilterDef[]): IDataObject {
	const out: IDataObject = {};
	for (const def of defs) {
		const value = values[def.id];
		if (value === undefined || value === null || value === '') continue;
		if (Array.isArray(value)) {
			const list = value.map((v) => String(v).trim()).filter((v) => v);
			if (list.length) out[def.key] = list.join(def.join ?? ',');
			continue;
		}
		if (typeof value === 'string') {
			const text = value.trim();
			if (text) out[def.key] = text;
			continue;
		}
		out[def.key] = value;
	}
	return out;
}

export function buildPeopleFilters(values: IDataObject): IDataObject {
	return build(values, PEOPLE);
}

export function buildCompanyFilters(values: IDataObject): IDataObject {
	return build(values, COMPANY);
}

/** The filters of a saved search, as the API takes them again (the request as sent when the list kept it). */
export function savedSearchFilters(list: IDataObject): IDataObject {
	const filters = (list.filters ?? {}) as IDataObject;
	const request = filters.request;
	const source = request && typeof request === 'object' && Object.keys(request).length ? (request as IDataObject) : filters;
	const out: IDataObject = {};
	for (const [key, value] of Object.entries(source)) {
		if (key === 'record_type' || key === 'request' || key === 'resolved') continue;
		if (value === undefined || value === null || value === '') continue;
		out[key] = value;
	}
	return out;
}
