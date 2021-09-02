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
	const locale_forums_data = [
		[ 'Global', 'global' ],
		[ 'Afrikaans', 'af' ],
		[ 'Aragonés', 'an' ],
		[ 'Arpitan', 'frp' ],
		[ 'Asturianu', 'ast' ],
		[ 'Azərbaycan Türkcəsi', 'az-tr' ],
		[ 'Azərbaycan dili', 'az' ],
		[ 'Bahasa Indonesia', 'id' ],
		[ 'Bosanski', 'bs' ],
		[ 'Brezhoneg', 'bre' ],
		[ 'Burmese', 'mya' ],
		[ 'Català', 'ca' ],
		[ 'Cebuano', 'ceb' ],
		[ 'Corsu', 'co' ],
		[ 'Dansk', 'da' ],
		[ 'Deutsch', 'de' ],
		[ 'Eesti', 'et' ],
		[ 'Español', 'es' ],
		[ 'Esperanto', 'eo' ],
		[ 'Euskara', 'eu' ],
		[ 'Hrvatski', 'hr' ],
		[ 'Italiano', 'it' ],
		[ 'Nederlands', 'nl' ],
		[ 'O‘zbekcha', 'uz' ],
		[ 'Polski', 'pl' ],
		[ 'Português de Angola', 'pt-ao' ],
		[ 'Português do Brasil', 'br' ],
		[ 'Português', 'pt' ],
		[ 'Română', 'ro' ],
		[ 'Shqip', 'sq' ],
		[ 'Slovenčina', 'sk' ],
		[ 'Suomi', 'fi' ],
		[ 'Svenska', 'sv' ],
		[ 'Tagalog', 'tl' ],
		[ 'Čeština', 'cs' ],
		[ 'Ελληνικά', 'el' ],
		[ 'Беларуская мова', 'bel' ],
		[ 'Български', 'bg' ],
		[ 'Македонски', 'mk' ],
		[ 'Русский', 'ru' ],
		[ 'Српски', 'sr' ],
		[ 'Українська', 'uk' ],
		[ 'Հայերեն', 'hy' ],
		[ 'עִבְרִית', 'he' ],
		[ 'ئۇيغۇرچە', 'ug' ],
		[ 'اردو', 'ur' ],
		[ 'الدارجة الجزايرية', 'arq' ],
		[ 'العربية المغربية', 'ary' ],
		[ 'العربية', 'ar' ],
		[ 'بلوچی مکرانی', 'bcc' ],
		[ 'मराठी', 'mr' ],
		[ 'हिन्दी', 'hi' ],
		[ 'অসমীয়া', 'as' ],
		[ 'বাংলা', 'bn' ],
		[ 'ไทย', 'th' ],
		[ 'རྫོང་ཁ', 'dzo' ],
		[ 'ქართული', 'ka' ],
		[ 'አማርኛ', 'am' ],
		[ '日本語', 'ja' ],
		[ '繁體中文', 'tw' ],
		[ '简体中文', 'cn' ],
	];

	const user_lang = JSON.parse( localStorage.getItem( 'wporg_support_links_lang' ) || '{ "current": "global", "alternative": false }' );

	let language_picker = '<li><div id="forums_label_default">Choose forum language:</div><div id="forums_label_custom"><a href="#">Switch to Romanian</a> or:</div><select id="forums_locales">';
	locale_forums_data.forEach( ( locale ) => {
		const [ lang_txt, lang ] = locale;
		const selected = ( lang === user_lang.current ) ? ' selected="selected"' : '';
		language_picker += `<option value="${lang}" ${selected}>${lang_txt}</option>`;
	} );
	language_picker += '</select></li>';
	jQuery( '#user-meta' ).append( language_picker );

	const forum_profile = `https://wordpress.org/support/users${location.pathname}`;
	const forum_links = [
		[ 'Forum Profile', forum_profile ],
		[ 'Edit Forum Profile', `${forum_profile}edit/` ],
		[ 'Topics Started', `${forum_profile}topics/` ],
		[ 'Replies Written', `${forum_profile}replies/` ],
		[ 'Reviews Written', `${forum_profile}reviews/` ],
	];

	forum_links.forEach( ( link ) => {
		const [ title, href ] = link;
		jQuery( '#user-meta' ).append( `<li><a class="wporg-forum-link" data-global-href="${href}" data-global-title="${title}" >${title}</a></li>` );
	} );

	const switcher = document.querySelector( '#forums_locales' );
	localize_links ( user_lang.current );


	switcher.addEventListener( 'change', ( ev ) => {
		if ( 'global' === ev.currentTarget.value ) {
			user_lang.alternative = user_lang.current;
		} else {
			user_lang.alternative = 'global';
		}
		user_lang.current = ev.currentTarget.value;
		localStorage.setItem( 'wporg_support_links_lang', JSON.stringify( user_lang ) );
		localize_links();
	  });

	function localize_links(){
		const profile_link = document.querySelector( '.wporg-forum-link' );
		profile_link.textContent = `${profile_link.dataset.globalTitle} (${switcher.options[ switcher.selectedIndex ].text})`;
		if ( 'global' === user_lang.current ) {
			document.querySelectorAll( '.wporg-forum-link' ).forEach( ( el ) => {
						el.href = el.dataset.globalHref;
			} );
		}

		if ( 'global' !== user_lang.current ) {
			document.querySelectorAll( '.wporg-forum-link' ).forEach( ( el ) => {
				el.href = el.dataset.globalHref.replace( 'wordpress.org', `${user_lang.current}.wordpress.org` );
			} );
		}

		if ( user_lang.alternative ) {
			document.querySelector( '#forums_label_default' ).style.display = 'none'; 
			const custom_label = document.querySelector( '#forums_label_custom' );
			custom_label.style.display = 'block';
			const switcher = custom_label.querySelector( 'a' );
			switcher.innerText = `Switch to ${ user_lang.alternative }`;
		}

	}

	const wporg_style =	`
	#forums_locales {
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

	#forums_locales,
	#forums_label_default,
	#forums_label_custom,
	.wporg-forum-link {
		float: left;
    }

	#forums_label_custom {
		display: none;
	}
	`;
	GM_addStyle( wporg_style );
} )();
