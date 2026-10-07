# App Drawer

Local-only draft launcher for Jason's home-server services and project links.

Run it from this folder with:

```bash
python3 -m http.server 4174
```

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
and apps with both appear in either view. `FEATURED` picks the big tile for each view.
