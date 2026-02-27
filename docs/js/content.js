// ===== Content Aggregator =====
// Chapters are loaded from individual files in js/chapters/
// This file aggregates them and provides LESSONS and CHEATSHEET to app.js

const LESSONS = (window.CHAPTERS || []).sort((a, b) => a.id - b.id);
const CHEATSHEET = window.CHEATSHEET || [];
