// ==UserScript==
// @name         Support Forum Links on Profile Page
// @namespace    wordpress.org
// @version      0.1
// @description  Adds user Support Forums links to user profile page
// @author       Vlad Timotei
// @match        https://profiles.wordpress.org/*
// ==/UserScript==

( function() {
	'use strict';
	const forum_profile = `https://wordpress.org/support/users${location.pathname}`;
	const forum_data = [
		[ 'Forum Profile', forum_profile ],
		[ 'Edit Forum Profile', `${forum_profile}edit/` ],
		[ 'Topics Started', `${forum_profile}topics/` ],
		[ 'Replies Written', `${forum_profile}replies/` ],
		[ 'Reviews Written', `${forum_profile}reviews/` ],
	];
	forum_data.forEach( ( forum_link_data ) => {
		const [ title, link ] = forum_link_data;
		jQuery( '#user-meta' ).append( `<li><a href="${link}">${title}</a></li>` );
	} );
} )();
