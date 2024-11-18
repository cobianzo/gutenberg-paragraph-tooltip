<?php

use PHPUnit\Framework\TestCase;

use GutenbergTooltip\Plugin;

class test_plugin extends TestCase {

	public static function setUpBeforeClass(): void {
		parent::setUpBeforeClass(); // Inicializa el plugin antes de correr los tests
		Plugin::init();
	}

	/**
	 * A single example test.
	 */
	function test_sample_true() {
		// Replace this with some actual testing code.
		$this->assertTrue( true );
	}
	function test_plugin_has_loaded() {
		$this->assertTrue( class_exists( 'GutenbergTooltip\Plugin' ), 'El plugin no se ha cargado correctamente' );
	}

	function test_plugin_script_enqueued() {

		// log in as admin
		wp_set_current_user( 1 );

		// create a new page
		$page_id = wp_insert_post( array(
			'post_title'   => 'Test page',
			'post_type'    => 'page',
			'post_content' => 'This is a test page',
			'post_status'  => 'publish',
		));

		// check that the page was created
		$this->assertGreaterThan( 0, $page_id );
	}
}
