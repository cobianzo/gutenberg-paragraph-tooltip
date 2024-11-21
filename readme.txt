=== GB CSS Tooltip ===

Contributors: @cobianzo
Tags: tooltip, links
Requires at least: 6.3
Tested up to: 6.7
Stable tag: 1.2.0
Requires PHP: 8.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Simple functionality that includes an extra option when editing a link within the block editor:
nice CSS tooltips.

== Description ==

This is a very simple plugin that allows you to associate a tooltip to any link in the block editor.
Open the link options, click on the pencil icon to edit it, then make sure that the Advanced panel
is open, and find the new input box for the tooltip.
You will see the tooltip when you hover with the mouse the link in the frontend.

Main features:
- new 'tooltip' input box in the CMS editor 'edit link', under 'Advanced' tab.
- showing this new field as a simple CSS-only tooltip in the frontend
- CSS rules use some variables to easily modify the aspect of the tooltip.

== Installation ==

This section describes how to install the plugin and get it working.
1. Upload `gb-css-tooltip` (link-to-github.zip) to the `/wp-content/plugins/` directory

2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= I am a developer, how can I modify this plugin? =
You can use the original development repo:
https://github.com/cobianzo/gutenberg-paragraph-tooltip
Follow the README.md instructions to install the dependencies and start coding.

== Screenshots ==

1. CMS View
2. Frontend View

== Changelog ==

= v1.0.1 =
Refactor for the inserrtion of the input, using Mutation Observer instead of an eventlistener.

* Initial release

== Upgrade Notice ==

...
