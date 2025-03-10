---
layout: null
---

{% assign fullPath = site.url | append: site.baseurl %}

{% include_relative bookmarklet-init.js url=fullPath %}
