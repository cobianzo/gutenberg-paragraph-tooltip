// import { test, expect } from '@playwright/test';
// import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';
import {
	test,
	expect,
	Admin,
	Editor,
} from '@wordpress/e2e-test-utils-playwright';

const commonCreateLinkWithTooltip = async ( { page, editor }, params = {
	linkURL: 'https://google.com',
	linkText: 'this is my link text',
	tooltipText: 'This is my tooltip',
} ) => {
	const { linkURL, linkText, tooltipText } = params;

	await editor.insertBlock( { name: 'core/paragraph' } );

	await page.keyboard.type( 'Lorem Ipsum dolor sit amet ' );
	await page.keyboard.press( 'ControlOrMeta+k' );
	await page.waitForTimeout( 3000 );
	await page.getByPlaceholder( 'Search or type URL' ).fill( linkURL );
	await page.getByLabel( 'Submit' ).click();
	await page.keyboard.press( 'ArrowLeft' );
	for ( let i = 0; i < linkURL.length; i++ ) {
		await page.keyboard.press( 'Backspace' );
	}

	await page.keyboard.type( linkText );
	await page.keyboard.press( 'ArrowRight' );
	await page.keyboard.type( ' : Finalise.' );

	for ( let i = 0; i < ' : Finalise.'.length + 1; i++ ) {
		await page.keyboard.press( 'ArrowLeft' );
	}

	await editor.canvas.locator( `a:has-text("${ linkText }")` ).click();

	await expect(
		page.getByLabel( 'Edit link', { exact: true } )
	).toBeVisible();

	page.getByLabel( 'Edit link', { exact: true } ).click();

	await page.waitForTimeout( 1000 );

	// this input is added by the plugin
	await expect(
		page.getByPlaceholder( 'Enter tooltip text', { exact: true } )
	).toBeVisible();

	await page
		.getByPlaceholder( 'Enter tooltip text', { exact: true } )
		.fill( tooltipText );

	await page
		.getByLabel( 'Editor content' )
		.getByRole( 'button', { name: 'Save' } )
		.click();

	// Assert that the plugin has created the attribute
	await expect(
		editor.canvas.getByRole( 'link', { name: linkText } )
	).toHaveAttribute( 'data-tooltip', tooltipText );
};

// Definition of Tests
// ==================================================================
// ==================================================================
// ==================================================================
test.describe( 'Creating the link and tooltip and ensure it all works fine in the CMS', () => {
	test.beforeEach( async ( { admin, page }: { admin: Admin; page: any } ) => {
		// login
		await page.goto( '/wp-login.php' );
		await page.getByLabel( 'Username or Email Address' ).fill( 'admin' );
		await page.getByLabel( 'Password', { exact: true } ).fill( 'password' );
		await page.getByRole( 'button', { name: 'Log In' } ).click();

		// first test
		await expect( page ).toHaveTitle( /Dashboard/ );

		const pageId = 2;
		await admin.visitAdminPage( '/post.php', `post=${ pageId }&action=edit` );

		await expect( page ).toHaveTitle( /Edit Page/ );
	} );

	test( `Test 1: Creating the link and the tooltip, ensuring the attribute data-tooltip is there `, async ( {
		page,
		editor,
	} ) => {
		const linkURL = 'https://google.com';
		const linkText = 'this is my link text';

		const tooltipText = 'This is my tooltip';

		await commonCreateLinkWithTooltip( { page, editor }, { linkURL, linkText, tooltipText } );
	} );
} );

// More tests:

// Test 2. create tooltips with strange chars.

// Test 3. create more than one tooltip.

// ...
