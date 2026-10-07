# App Drawer

Local-only draft launcher for Jason's home-server services and project links.

Run it from this folder with:

```bash
python3 -m http.server 4174
```

Then open http://localhost:4174.

This is intentionally not deployed. It contains LAN links to the Mac mini and should remain private unless those links are redesigned for public access.

## Adding or changing apps

Apps live in the `APPS` list at the top of `app.js`. Give each one a `home` address (on your
Wi-Fi), a `web` address (works anywhere), or both. The Home / Web switch shows the matching set,
and apps with both appear in either view. `FEATURED` picks the big tile for each view.
