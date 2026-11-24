// Entry for u-myronera-post-the-meme-win-the-feed-2de960bf (Node 22, stdlib only).
//
// The entry is a post on X. POST.json names it: {"url", "play_code"}.
// This program checks the link is a real x.com / twitter.com post address
// and that the play code is this bounty's code, then hands POST.json to
// the gate by copying it into the output directory. The house reads the
// post itself from X; nothing written here about the post is scored.
//
// Exit codes: 0 when the link and the code both check out, 1 with a
// message on stderr otherwise. A placeholder url such as POST_PENDING is
// refused on purpose, so a post that was never made can never pass: the
// real post address goes into POST.json before the entry is submitted.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const PLAY_CODE = 'makefun-sand-ironwood-cradle';

// A post address as X shows it: https://x.com/<handle>/status/<id>,
// or the same on twitter.com, with www. or mobile. in front, or the
// /i/web/status/<id> form. A query or fragment after the id is allowed.
const POST_URL_RE =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/(?:[A-Za-z0-9_]{1,15}\/status\/\d+|i\/web\/status\/\d+)(?:[?#].*)?$/;

function fail(message) {
  console.error(`invalid POST.json: ${message}`);
  process.exit(1);
}

const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
let post;
try {
  post = JSON.parse(raw);
} catch (err) {
  fail(`not valid JSON (${err.message})`);
}

if (typeof post.url !== 'string' || !POST_URL_RE.test(post.url)) {
  fail(`url must be an x.com / twitter.com post link, got ${JSON.stringify(post.url)}`);
}
if (post.play_code !== PLAY_CODE) {
  fail(`play_code must be ${PLAY_CODE}, got ${JSON.stringify(post.play_code)}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), raw);
writeFileSync(
  join(OUTPUT_DIR, 'entry.txt'),
  `post: ${post.url}\nplay_code: ${post.play_code}\nstatus: valid\n`,
);
console.log(`post OK: ${post.url}`);
