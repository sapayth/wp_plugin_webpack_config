<?php
/**
 * Plugin main file.
 *
 * @wordpress-plugin
 * Plugin Name:       Plugin Boilerplate
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action( 'admin_menu', 'our_custom_menu' );

function our_custom_menu() {
	add_menu_page( 'Plugin Page', 'Plugin Page', 'manage_options', 'custom-test', 'custom_render' );
}

function custom_render() {
	wp_enqueue_script( 'plugin-script', plugin_dir_url( __FILE__ ) . 'assets/js/main.js' );
	wp_enqueue_style( 'plugin-style', plugin_dir_url( __FILE__ ) . 'assets/css/main.css' );
	echo '<div id="plugin-page"></div>';
}