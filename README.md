# App Drawer

Local-only draft launcher for Jason's home-server services and project links.

Run it from this folder with:

```bash
python3 serve.py
```

This works like `python3 -m http.server 4174` but tells browsers, and the installed app, to always
check for the latest files, so updates show up straight away.

Then open http://localhost:4174.

The Home view contains LAN links to the Mac mini. These only work while connected to
your home Wi-Fi. The Web view contains links designed to work from anywhere.

## Server deployment

`compose.server.yml` runs the drawer as a static Nginx container on the existing
`jrapp-remote-access_default` Cloudflare Tunnel network. It deliberately does not
publish a host port. After deployment, Cloudflare should route the chosen public
hostname to `http://app-drawer:80`.

## Adding or changing apps

Apps live in the `APPS` list at the top of `app.js`. Give each one a `home` address (on your
Wi-Fi), a `web` address (works anywhere), or both. The Home / Web switch shows the matching set,
and apps with both appear in either view.

## Arranging tiles

Hold a tile for half a second to edit, then drag it to a new position or tap its minus
button to remove it. Tap Done to open links normally again. Restore removed brings
back hidden tiles. Home and Web layouts are saved separately in this browser's local
storage; clearing site data resets them. Keyboard: F2 enters edit mode, Alt + arrow
keys move a focused tile, and Escape finishes editing.
