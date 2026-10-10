# Real Estate Editor: the full brief

The long form of the brief, with every target and technique. The SKILL.md brief is the compact version that rides in the prompt; load this when planning a full edit in this style or when the user asks for detail.

INTENT: a buyer can picture walking the home; nothing is misrepresented.
SPEC: full walkthrough 60 to 120s (Zillow Showcase allows at most 120s and autoplays muted, so the first frames must sell without sound). Shots 2 to 4s, none over 6s except the hero and outro; 8 to 10 clips for a full tour; a 40s hallway pass becomes about 8s. Digital push-ins of 4 to 10% at most. Vertical social cut under 30s at 9:16, clips 1 to 2s, the best 4 to 6 features. MLS cut: 16:9 at 1920x1080, under 200 MB, with zero agent or brokerage names, logos, phone numbers, links or yard signs. Spec card (beds, baths, area, price only if the user supplied them) after the hero; short room labels on entry to key rooms.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· The room sequence from the footage (entry, living, kitchen, bedrooms with their baths) and any doubling back.
· Screen direction per clip (which way the camera moves), so direction continues room to room.
· Usable seconds per clip before the move repeats.
· White balance per room and how much of each window is clipped to white.
· Branding in frame for the MLS cut: names, logos, phone numbers, web addresses, yard signs.
· Listing facts the user supplied (beds, baths, area). Never infer them from footage.
· Any digitally altered shot (virtual staging, sky replacement) that needs a disclosure.
CRAFT
· One route, walking order, never double back: exterior hero, entry, living, kitchen and dining, primary suite with its bath, other bedrooms with the hall bath, a standout detail, outdoor space, neighbourhood, outro.
· Open on the strongest exterior or aerial in the first 2 to 3s.
· Trim to 2 to 4s per shot; a beautiful gimbal move still ends under 3s unless it reveals new space; bathrooms get the shortest holds.
· Keep screen direction continuous between adjacent rooms.
· Hard cuts or short crossfades only (setTransitions); speed through hallways and stairs (setSpeed) instead of showing them whole.
· Choose the music first and let its tempo set shot length (musicBed); instrumental and licence-safe.
· Colour per room, then match: neutral to slightly warm, lifted shadows, real window views kept (setColor; an object mask on the window for a pull, never a swapped view).
· Spec card and room labels with addTitle; on 9:16 keep text clear of the bottom 35% and the right rail.
· Two masters from one timeline: branded (agent intro, logo, contact) for social, and unbranded for MLS with every name, logo, contact and sign removed (blurFaces will not catch a sign; use a masked blur region).
· Describe places, never people: "3 blocks to the park", not who the area suits.
DO NOT: hold a shot 6s or more; jump around the floor plan or reverse direction between rooms; agent branding, phone numbers or yard signs in the MLS cut; fair-housing red-flag words ("perfect for families", "ideal for singles", "exclusive"); wide-angle stretch, replaced views or skies, or hidden defects without disclosure; wipes, spins or heavy looks that shift wall colours; invented bed, bath or area figures.
ACCEPT: clips follow one non-reversing walking order, median shot length is 2 to 4s with none over 6s except hero and outro, the MLS cut is 120s or less at 16:9 1080p with no detected branding, no window is clipped to white, and every spec caption matches facts the user supplied.
