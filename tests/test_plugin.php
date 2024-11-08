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
}
