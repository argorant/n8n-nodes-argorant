import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

type FilterTarget = 'query' | 'body';

const SENIORITY: INodePropertyOptions[] = [
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
].map((value) => ({ name: value, value }));

const DEPARTMENTS: INodePropertyOptions[] = [
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
].map((value) => ({ name: value, value }));

const EMPLOYEE_RANGES: INodePropertyOptions[] = [
	{ name: '1-10', value: '1-10' },
	{ name: '11-50', value: '11-50' },
	{ name: '51-200', value: '51-200' },
	{ name: '201-500', value: '201-500' },
	{ name: '501-1,000', value: '501-1000' },
	{ name: '1,001-5,000', value: '1001-5000' },
	{ name: '5,001-10,000', value: '5001-10000' },
	{ name: '10,000+', value: '10000+' },
];

/**
 * The people filters shared by Lead > Count, Lead > Search, List > Create and List > Add People.
 * Count and search send them as query parameters, lists send them in the body under `filters`.
 */
export function peopleFilterOptions(target: FilterTarget): INodeProperties[] {
	const property = (key: string) => (target === 'body' ? `filters.${key}` : key);
	const text = (
		displayName: string,
		name: string,
		key: string,
		description: string,
		placeholder: string,
	): INodeProperties => ({
		displayName,
		name,
		type: 'string',
		default: '',
		placeholder,
		description,
		routing: { send: { type: target, property: property(key) } },
	});
	const multi = (
		displayName: string,
		name: string,
		key: string,
		description: string,
		options: INodePropertyOptions[],
	): INodeProperties => ({
		displayName,
		name,
		type: 'multiOptions',
		options,
		default: [],
		description,
		routing: {
			send: { type: target, property: property(key), value: '={{ $value.join(",") }}' },
		},
	});

	return [
		{
			displayName: 'Business Email Only',
			name: 'businessEmailOnly',
			type: 'boolean',
			default: false,
			description: "Whether to keep only people whose email is at their company's own domain",
			routing: { send: { type: target, property: property('business_email_only') } },
		},
		text('Cities', 'city', 'city', 'Cities, separated by commas', 'e.g. Munich, Berlin'),
		text(
			'Company Domains',
			'companyDomain',
			'company_domain',
			'Company website domains, separated by commas',
			'e.g. example.com',
		),
		text(
			'Company Names',
			'companyName',
			'company_name',
			'Company names as written. Separate several names with |.',
			'e.g. Linfield',
		),
		text(
			'Countries',
			'country',
			'country',
			'Countries or regions (Europe, DACH, Nordics, APAC, LATAM), separated by commas',
			'e.g. Germany, Austria',
		),
		multi('Departments', 'departments', 'departments', 'Departments to include', DEPARTMENTS),
		multi(
			'Employee Ranges',
			'employeeRange',
			'employee_range',
			'Company sizes to include',
			EMPLOYEE_RANGES,
		),
		text(
			'Exclude Job Titles',
			'excludeTitle',
			'exclude_title',
			'Leave out people with these job titles, separated by commas',
			'e.g. assistant, intern',
		),
		text(
			'Industry',
			'industry',
			'industry',
			'One industry in plain words',
			'e.g. software',
		),
		text(
			'Job Titles',
			'title',
			'title',
			'Job titles, separated by commas. Abbreviations work: CFO also finds Chief Financial Officer.',
			'e.g. CFO, VP Finance',
		),
		text(
			'Keywords',
			'keywords',
			'keywords',
			'Words that describe what the company does, separated by commas',
			'e.g. solar, renewable',
		),
		text(
			'Search Text',
			'q',
			'q',
			'Plain text across name, title, company and description',
			'e.g. head of growth',
		),
		multi('Seniority', 'seniority', 'seniority', 'Seniority levels to include', SENIORITY),
		text(
			'States',
			'state',
			'state',
			'States or provinces, by name or code, separated by commas',
			'e.g. Bavaria',
		),
	];
}

export function peopleFiltersCollection(
	target: FilterTarget,
	show: Record<string, string[]>,
): INodeProperties {
	return {
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show },
		options: peopleFilterOptions(target),
	};
}

/** Turns "a, b ,c" into ["a","b","c"]; used by fields that take several IDs. */
export const SPLIT_IDS = '={{ String($value).split(",").map((s) => s.trim()).filter((s) => s) }}';
