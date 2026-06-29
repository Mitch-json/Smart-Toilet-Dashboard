# EGERLOO Pico W firmware

The integrated Smart-Toilet firmware: your existing sensor/relay/motor/OLED control
logic plus a dashboard bridge that serves live data and shows a face-recognition
welcome message.

## What it adds to the base firmware

- **Core 1 HTTP server** (raw sockets, no extra libraries) so requests are answered
  even while the control loop is busy with a flush sequence.
  - `GET /status` - JSON snapshot the dashboard polls every 2s
  - `POST /recognition` - `{name, confidence, ts}`; shows `Welcome <name>!` on the OLED for 3s
  - `OPTIONS` - CORS preflight
- **`Welcome <name>!`** rendered on the existing SH1106 OLED, then auto-returns to tank levels.
- **Display lock** so core 0 (tank levels) and core 1 (welcome) never collide on I2C.
- **Secrets moved to `secrets.py`** (gitignored).

## Files to copy to the Pico

- `main.py`
- `secrets.py` (create from `secrets.example.py`)
- `sh1106.py` (your OLED driver - already on the Pico)
- `umail.py` (email helper - already on the Pico)

## Setup

1. Copy `secrets.example.py` to `secrets.py` and fill in WiFi + Gmail values.
   (Recommended: rotate the Gmail App Password, since it previously lived in source.)
2. Copy `main.py` and `secrets.py` onto the Pico W.
3. Reset the Pico and open the serial console. It prints:
   - `IP address: <ip>`
   - `Web server listening on port 80`
4. In the dashboard project root, set `.env`:
   ```
   VITE_PICO_URL=http://<ip>
   ```
5. Restart `npm run dev` so Vite picks up the env change.

## Status field mapping

`GET /status` returns the dashboard's `PicoStatus` shape:

- `liquidLevel`  = urine tank %
- `solidLevel`   = poop tank %
- `motionDetected` = door ON (someone inside)
- `relayStatus`  = solenoid valve state (the "gate")
- `batteryLevel` = `100` placeholder (mains powered, no battery sensor)
- `totalUsageCount` = persisted `user_count`

## Verify

- Open `http://<pico-ip>/status` - you should see JSON with live tank levels.
- Dashboard banner shows "Pico Connected".
- Face Recognition tab: recognizing a known user shows `Welcome <name>!` on the OLED
  for 3 seconds (even during a flush sequence), then returns to tank levels.

## Notes

- CORS is wide open (`*`) for prototype convenience.
- Keep the dashboard on `http://localhost` so the browser can call the Pico's `http://` endpoint.
- Recognition is display-only; it does not change any relays/motor.
