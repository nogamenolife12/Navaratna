# Project Notes: Full-Stack Vedic Gemstone Recommendation App (Navaratna)

## Tech Stack
- **Frontend**:
  - **Structure**: Semantic HTML5 (with native `<dialog>` tags for overlays and modular containers).
  - **Styling**: Vanilla CSS3. Utilizes CSS Custom Properties (Variables) for theming, CSS Grid & Flexbox for layouts, glassmorphism (`backdrop-filter`), and keyframe animations for gemstone glows and fade effects.
  - **Client Controller**: Modern client-side Javascript. Coordinates state tracking, view changes, and makes fetch requests to backend endpoints to gather data and recommendations.
- **Backend**:
  - **Server**: Node.js and Express.js. Serves front-end assets statically and mounts API routes.
  - **Data Store**: A JSON database (`data/gemstones.json`) holding the data profiles of the nine gemstones.
  - **Astrology Engine**: Server-side recommendation algorithm written in JS.

## Architecture
This app separates concerns by separating the UI presentation from the data and recommendation logic:
1. **Gemstones JSON Store**: Placing the gemstone data profiles in a JSON file decouples the data from both the frontend layout and the server code, making updates to gemstone descriptions or properties modular.
2. **API Layer (`/api`)**:
   - `GET /api/gemstones`: Serves the list of gemstones from the JSON data.
   - `GET /api/gemstones/:id`: Returns details of a specific gemstone profile.
   - `POST /api/recommend`: Computes the recommendations. Relies on Rashi (Moon Sign), desires (wealth, health, love, etc.), and blockages, filtering out any gemstones that share planetary enmity with the primary zodiac stone.
3. **Static Resource Server**: Serves files located in `/public` (`index.html`, `style.css`, and client-side `app.js`).

## Assumptions
- **Simplified Astrology**: True Vedic astrology is highly customized and requires a complete birth chart (Kundali) which is calculated using the exact time and place of birth, along with complex ephemeris algorithms. This app uses simplified Rashi (Zodiac/Moon sign) and life goal/temperament indicators as a user-friendly proxy.
- **User Familiarity**: We assume users might know their Moon Sign (Rashi) or Sun Sign. We provide simple tooltips or instructions to help them select their sign.
- **Wearing Instructions**: The wearing instructions are aligned with general, widely-accepted north-Indian Vedic traditions (e.g. specific finger, specific day, chanting 108 times).

## Future Improvements
- **Kundali Calculator API**: Integrate a birth-chart API to generate accurate planetary charts based on precise date, time, and latitude/longitude of birth.
- **Panchang / Muhurta API**: Integrate a live Hindu calendar API to tell the user the exact next auspicious day and hour (Muhurta) to wear their gemstone based on their current location.
- **Gemstone Authenticity Guide**: Add an educational module on how to distinguish genuine natural gemstones from synthetics or glass imitations.
- **Audio Mantras**: Add high-quality audio chants/mantras in the Ritual Simulator to guide users through the pronunciation and 108-repetition rhythm.
