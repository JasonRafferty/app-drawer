#!/usr/bin/env python3
"""Serve the app drawer locally.

Like `python3 -m http.server`, but tells browsers (and installed home-screen apps)
to check for the latest files every time, so updates show up straight away.

Usage: python3 serve.py [port]   (default 4174)
"""
import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4174


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Revalidate on every load; unchanged files still come back as a quick 304.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory=os.path.dirname(os.path.abspath(__file__)))
print(f"App Drawer on http://localhost:{PORT}")
http.server.ThreadingHTTPServer(("", PORT), handler).serve_forever()
