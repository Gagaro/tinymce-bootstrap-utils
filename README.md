# tinymce-bootstrap-utils

TinyMCE 4 plugin to use bootstrap 3 features.

Current supported feature is :

* collapse

How to install the plugin
=========================

1. copy `bootstrap_utils` folder to the tinymce `plugins` folder.

2. set up your instance in the tinyMCE.init method to use the plugin, like::

  plugins : "... bootstraputils ..."

3. set up your instance to use the buttons you want, for example::

  toolbar : "... | bootstrap-collapse"
