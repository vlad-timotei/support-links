// ==UserScript==
// @name         Support Forum Links on Profile Page
// @namespace    wordpress.org
// @version      0.1
// @description  Adds user Support Forums links to user profile page
// @author       Vlad Timotei
// @match        https://profiles.wordpress.org/*
// @grant        GM_addStyle
// ==/UserScript==

( function() {
	'use strict';
	interface User {
		current: string,
		alternative: boolean | string,
	}
	const user_forums: User = JSON.parse( localStorage.getItem( 'wporg_forum_languages' ) || '{ "current": "global", "alternative": false }' );
	// List of forums based on https://make.wordpress.org/support/handbook/contributing-to-the-wordpress-forums/support-forums-in-your-language/
	interface Languages {
		[ index: string ]: string;
	};

	const forum_languages: Languages = {
		'global': 'Global',
		'af':     'Afrikaans',
		'frp':    'Arpitan',
		'ast':    'Asturianu',
		'az-tr':  'Azərbaycan Türkcəsi',
		'az':     'Azərbaycan dili',
		'id':     'Bahasa Indonesia',
		'bs':     'Bosanski',
		'bre':    'Brezhoneg',
		'mya':    'Burmese',
		'ca':     'Català',
		'ceb':    'Cebuano',
		'co':     'Corsu',
		'da':     'Dansk',
		'de':     'Deutsch',
		'et':     'Eesti',
		'es':     'Español',
		'eo':     'Esperanto',
		'eu':     'Euskara',
		'hr':     'Hrvatski',
		'it':     'Italiano',
		'nl':     'Nederlands',
		'uz':     'O‘zbekcha',
		'pl':     'Polski',
		'pt-ao':  'Português de Angola',
		'br':     'Português do Brasil',
		'pt':     'Português',
		'ro':     'Română',
		'sq':     'Shqip',
		'sk':     'Slovenčina',
		'fi':     'Suomi',
		'sv':     'Svenska',
		'tl':     'Tagalog',
		'cs':     'Čeština',
		'el':     'Ελληνικά',
		'bel':    'Беларуская мова',
		'bg':     'Български',
		'mk':     'Македонски',
		'ru':     'Русский',
		'sr':     'Српски',
		'uk':     'Українська',
		'hy':     'Հայերեն',
		'he':     'עִבְרִית',
		'ug':     'ئۇيغۇرچە',
		'ur':     'اردو',
		'arq':    'الدارجة الجزايرية',
		'ary':    'العربية المغربية',
		'ar':     'العربية',
		'bcc':    'بلوچی مکرانی',
		'mr':     'मराठी',
		'hi':     'हिन्दी',
		'as':     'অসমীয়া',
		'bn':     'বাংলা',
		'th':     'ไทย',
		'dzo':    'རྫོང་ཁ',
		'ka':     'ქართული',
		'am':     'አማርኛ',
		'ja':     '日本語',
		'tw':     '繁體中文',
		'cn':     '简体中文',
	};

	// Create links.
	const forum_links: DocumentFragment = document.createDocumentFragment();
	const forum_profile: string = `https://wordpress.org/support/users${location.pathname}`;

	const forum_views: [ string, string ][] = [
		[ 'Forum Profile', forum_profile ],
		[ 'Edit Forum Profile', `${forum_profile}edit/` ],
		[ 'Topics Started', `${forum_profile}topics/` ],
		[ 'Replies Written', `${forum_profile}replies/` ],
		[ 'Reviews Written', `${forum_profile}reviews/` ],
	];

	forum_views.forEach( ( link: [ string, string ] ) => {
		const [ title, href ]: [ string, string ] = link;
		const li: HTMLLIElement = document.createElement( 'li' );
		const a: HTMLAnchorElement = document.createElement( 'a' );
		a.className = 'wporg-forum-link';
		a.dataset.globalHref = href;
		a.dataset.globalTitle = a.textContent = title;
		li.appendChild( a )
		forum_links.appendChild( li );
	} );

	// Create language picker.
	const language_picker: HTMLLIElement = document.createElement( 'li' );
	const default_label: HTMLDivElement = document.createElement( 'div' );
	default_label.id = 'forums_label_default';
	default_label.textContent = 'Choose forum language:';

	const custom_switcher: HTMLDivElement = document.createElement( 'div' );
	const custom_switcher_a: HTMLAnchorElement = document.createElement( 'a' );
	custom_switcher.id = 'forums_label_custom';
	custom_switcher.textContent = ' or to:';

	const forum_locales: HTMLSelectElement = document.createElement( 'select' );
	forum_locales.id = 'forum_locales';

	Object.entries( forum_languages ).forEach( ( forum: [ string, string ] ) => {
		const [ forum_slug, forum_lang ]: [ string, string ] = forum;
		const forum_option: HTMLOptionElement = document.createElement( 'option' );
		forum_option.value = forum_slug;
		( forum_slug === user_forums.current ) && ( forum_option.selected = true);
		forum_option.textContent = forum_lang;
		forum_locales.appendChild( forum_option );
	} );

	custom_switcher.prepend( custom_switcher_a );
	language_picker.append( default_label, custom_switcher, forum_locales );

	// Display & localize eveything.
	document.querySelector( '#user-meta' )!.append( forum_links, language_picker );
	const profile_link: HTMLElement = document.querySelector( '.wporg-forum-link' ) as HTMLElement;
	localize_links();

	// Event: User selects a new locale from the list.
	forum_locales.addEventListener( 'change', ( ev:Event ) => {
		const cTarget: HTMLSelectElement = ev.currentTarget as HTMLSelectElement;
		const chosen_language: string = cTarget.value;
		user_forums.alternative = ( 'global' === chosen_language ) ? user_forums.current : 'global';
		user_forums.current = chosen_language;
		localize_links();
	} );

	// Event: User switches between locale and global.
	custom_switcher.addEventListener( 'click', () => {
		const temp_current: string | boolean = user_forums.current;
		user_forums.current = user_forums.alternative as string;
		user_forums.alternative = temp_current;
		const currentAlt: HTMLOptionElement = forum_locales.querySelector( `[value="${user_forums.current}"]` ) as HTMLOptionElement;
		if ( currentAlt ) {
			currentAlt.selected = true;
		}
		localize_links();
	} );

	// Localize function.
	function localize_links() {
		profile_link.textContent = `${profile_link.dataset.globalTitle} (${forum_languages[ user_forums.current ]})`;
		const links: NodeList = document.querySelectorAll( '.wporg-forum-link' )
		links.forEach( ( el:Node ) => {
			( el as HTMLAnchorElement ).href = 
				( 'global' === user_forums.current ) ?
				( el as HTMLAnchorElement ).dataset.globalHref as string :
				( el as HTMLAnchorElement ).dataset.globalHref!.replace( 'wordpress.org', `${user_forums.current}.wordpress.org` ) as string;
		} );

		if ( user_forums.alternative ) {
			default_label.style.display = 'none';
			custom_switcher.style.display = 'block';
			custom_switcher_a.innerText = `Switch to ${forum_languages[ user_forums.alternative as string ]}`;
		}
		localStorage.setItem( 'wporg_forum_languages', JSON.stringify( user_forums ) );
	}

	// Style me, please!
	const wporg_style =	`
	#forum_locales {
    	font-size: 14px;
		border-color: #8c8f94;
		border-radius: 3px;
		padding: 0 28px 0 8px;
		min-height: 30px;
		-webkit-appearance: none;
		background: #fff url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%206l5%205%205-5%202%201-7%207-7-7%202-1z%22%20fill%3D%22%23555%22%2F%3E%3C%2Fsvg%3E) no-repeat right 5px top 55%;
		background-size: 16px 16px;
		cursor: pointer;
		clear: both;
	}

	#forum_locales,
	#forums_label_default,
	#forums_label_custom,
	.wporg-forum-link {
		float: left;
    }

	#forums_label_custom {
		display: none;
		cursor: pointer;
	}

	#forums_label_default,
	#forums_label_custom {
		padding-bottom: 5px;
	}
	`;
	( window as any ).GM_addStyle( wporg_style );
} )();
