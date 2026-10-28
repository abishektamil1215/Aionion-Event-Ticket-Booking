# Distinct event covers

Generated with the built-in imagegen tool. These are fictional Indian people and illustrative event settings, not photographs of real Aionion events. Each demo event has one stable, unique cover. An event retains that cover on its detail and checkout pages so its identity stays consistent.

The default homepage assigns separate events to its hero, featured, upcoming and recommended sections. Explicit date/category/nearby filters still search the full catalogue. The event gallery excludes the current event's cover and removes duplicate image URLs.

## Shared prompt direction

One premium photorealistic editorial event-cover photograph, wide landscape 16:9, no collage. Indian financial/professional setting; all visible people are fictional Indian adults, authentic contemporary attire and natural expressions. Realistic hands and faces. Tasteful navy, ivory and warm natural light; distinctive composition. No readable text, logos, watermarks or public figures.

## Individual prompts and saved files

- `market-outlook.webp`: early-morning strategy keynote in a boutique Chennai auditorium; Indian male strategist at a lectern, abstract market projection, three audience profiles; bright architectural daylight and front-left camera.
- `market-pulse.webp`: Indian male analyst hosting an online broadcast at a desk, microphone, laptop and softly blurred market monitor; close medium studio shot with evening navy light.
- `money-basics.webp`: young Indian professionals learning budgeting with a female educator, flipchart, notebooks and calculators; bright Hyderabad learning studio with warm daylight.
- `balance-sheet.webp`: over-the-shoulder analytical workshop with an Indian mentor and two professionals examining annual reports, calculator and printed statements at a walnut table.
- `risk-workshop.webp`: Indian instructor demonstrating portfolio risk on a glass board, abstract blue curves and four attentive professionals; modern Mumbai training room.
- `retirement.webp`: mature Indian couple and a wealth adviser discussing planning over tea at a round table; calm, sunlit Delhi office.
- `relationship-day.webp`: Indian female adviser and male client reviewing a portfolio across a neat desk with a tablet and folder; elegant Chennai office.
- `tax-webinar.webp`: Indian woman presenting an online tax masterclass from a home office, laptop/webcam and a small desk chart; warm evening light.
- `global-markets.webp`: Mumbai investing briefing in a glass meeting suite at dusk, abstract world-map projection, Indian presenter and eight professionals around a curved table.
- `investor-day.webp`: public financial-literacy open day in a Coimbatore convention foyer, Indian families, students and professionals at consultation tables; bright welcoming setting.
- `legacy-circle.webp`: private family-wealth gathering in a Mumbai residential library, six Indian adults and senior adviser in a semicircle; understated formal attire and warm lighting.
- `strategy-dinner.webp`: private Chennai strategy dinner, six Indian professionals at a long table, restrained flowers and warm pendant lights; candid diagonal composition.
- `investor-roundtable.webp`: eight Indian founders and family-office professionals at a circular dark-oak table in a Delhi members club; tall windows, heritage details and afternoon light.
- `quarterly-review.webp`: four Indian analysts reviewing results in a compact Chennai boardroom, laptop and abstract line chart; candid doorway composition in monsoon daylight.

The existing `conference.webp`, `workshop.webp` and `networking.webp` remain assigned exclusively to Money Pechu, Allocation Masterclass and Founders & Capital Evening respectively. See ASSETS.md for those prompts and the portrait prompt set. The shared visual library uses distinct files for each context; it no longer aliases all event types to three pictures.

WebP files are stored in this directory and encoded at up to 1440px wide. Generation originals are retained in the imagegen output directory. `server/smoke.test.js` verifies that all demo event covers exist and have unique URLs.
