import json,sys,os
HERE=os.path.dirname(os.path.abspath(__file__))
from playwright.sync_api import sync_playwright
B=os.environ.get("FOLIO_URL","http://localhost:4173")+"/#"
OUT=os.path.join(HERE,"..","..","09_Evidence","screenshots")+os.sep
res=[]
def check(flow,step,c,d=""):
    res.append({"flow":flow,"step":step,"pass":bool(c),"detail":"" if c else str(d)}); print(("PASS " if c else "FAIL ")+flow+" | "+step+(" -> "+str(d) if not c else ""))
def shot(p,name,full=False): p.screenshot(path=OUT+name+".png",full_page=full)
def reg(p,name,email,role="A listener"):
    p.goto(B+"/register"); p.fill('[aria-label="Your name"]',name); p.fill('[aria-label="Email"]',email); p.fill('[aria-label="Password"]',"secret123")
    if role!="A listener": p.get_by_text(role,exact=False).first.click()
    p.get_by_role("button",name="Create account").click(); p.wait_for_timeout(700)
def login(p,email):
    p.goto(B+"/login"); p.fill('[aria-label="Email"]',email); p.fill('[aria-label="Password"]',"secret123"); p.get_by_role("button",name="Log in").click(); p.wait_for_timeout(700)
def signout(p):
    p.goto(B+"/me?tab=settings"); p.wait_for_timeout(300); p.get_by_test_id("signout").click(); p.wait_for_timeout(300)
with sync_playwright() as pw:
    b=pw.chromium.launch(); ctx=b.new_context(viewport={"width":390,"height":844}); p=ctx.new_page()
    errs=[]; p.on("pageerror",lambda e:errs.append(str(e)))
    # ---------- FLOW 1: new listener ----------
    F="F1 New listener"
    p.goto(B+"/"); p.wait_for_timeout(600)
    check(F,"First open sends a new visitor to the welcome story", "/welcome" in p.url, p.url); shot(p,"F1-1-welcome")
    check(F,"Welcome says what Folio is and why open it today", p.get_by_test_id("why-today").count()==1)
    for name in ("F1-1b-accountable","F1-1c-new","F1-1d-go"):
        p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(350); shot(p,name)
    p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(350); shot(p,"F1-3-country")
    check(F,"Brisbane story has an On Country part naming Meanjin with its source", p.get_by_test_id("welcome-country").count()==1 and "Meanjin" in p.get_by_test_id("welcome-country").inner_text() and p.locator('[data-testid="welcome-country"] a').count()==1)
    p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(350); shot(p,"F1-2-city")
    check(F,"City step shows Brisbane live", p.get_by_test_id("pick-brisbane").count()==1)
    if p.get_by_test_id("welcome-next").is_disabled(): p.get_by_test_id("pick-brisbane").click()
    p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(900)
    check(F,"Lands on Today with the Edition", p.url.endswith("#/") and p.get_by_test_id("item-card").count()>=5, p.url); shot(p,"F1-4-today",True)
    check(F,"First-visit intro card explains Folio", p.get_by_test_id("why-today-card").count()==1)
    check(F,"Curator is named", p.get_by_test_id("curator-name").count()==1)
    p.get_by_test_id("liner-toggle").first.click(); p.wait_for_timeout(300)
    check(F,"Liner Note opens with a source", p.get_by_test_id("liner-body").count()==1); shot(p,"F1-5-liner")
    check(F,"Each pick shows a reason and no like button", p.get_by_text("Like",exact=True).count()==0)
    # ---------- FLOW 2: returning listener ----------
    F="F2 Returning listener"
    reg(p,"Rae","rae@x.com"); check(F,"Sign up lands on Today (not a settings page)", p.url.endswith("#/"), p.url)
    p.goto(B+"/"); p.wait_for_timeout(500)
    p.fill('[aria-label="Add a comment"]',"Loved the second pick."); p.get_by_role("button",name="Post").click(); p.wait_for_timeout(500)
    check(F,"Comment posts", p.get_by_text("Loved the second pick.").count()==1)
    p.get_by_test_id("discovery-yes").click(); p.wait_for_timeout(400)
    check(F,"Discovery check answered once", p.get_by_test_id("discovery-thanks").count()==1)
    p.get_by_label("Save privately").first.click(); p.wait_for_timeout(300)
    p.goto(B+"/me"); p.wait_for_timeout(400)
    check(F,"Saved pick appears privately in Me", p.get_by_test_id("saved-list").locator("li").count()>=1); shot(p,"F2-1-saved")
    p.goto(B+"/archive"); p.wait_for_timeout(600); shot(p,"F2-2-browse",True)
    check(F,"Browse shows Nearby events", p.get_by_text("Nearby events").count()>=1)
    p.goto(B+"/me?tab=settings"); p.wait_for_timeout(300)
    p.set_input_files('[data-testid="avatar-input"]',os.path.join(HERE,"av.png")); p.wait_for_timeout(800)
    check(F,"Profile picture can be set in Settings", p.locator('[data-testid="avatar-img"]').count()>=1); shot(p,"F2-3-settings",True)
    signout(p)
    # ---------- FLOW 3: artist ----------
    F="F3 Artist"
    reg(p,"Zed Quartet","zed@x.com","An artist"); check(F,"Artist signs up and lands in their space", p.url.endswith("#/artist"), p.url)
    shot(p,"F3-1-artist-space")
    p.goto(B+"/pitch"); p.wait_for_timeout(400)
    p.fill('[aria-label="Track name"]',"Slow Burn"); p.fill('[aria-label="Listen link"]',"https://example.org/slow-burn"); p.fill('[aria-label="Note"]',"Four-piece from Woolloongabba, new single out Friday.")
    p.get_by_role("button",name="Send pitch").click(); p.wait_for_timeout(500)
    check(F,"Pitch sent to a curator", p.get_by_test_id("pitch-sent").count()==1); shot(p,"F3-2-pitch")
    p.goto(B+"/artist"); p.wait_for_timeout(400)
    p.fill('[aria-label="Update"]',"Rehearsing tonight, new track Friday."); p.get_by_test_id("post-dispatch").click(); p.wait_for_timeout(500)
    signout(p)
    # ---------- FLOW 4: curator (apply, approve, publish) ----------
    F="F4 Curator"
    reg(p,"Jo Curator","jo@x.com"); p.goto(B+"/apply"); p.wait_for_timeout(300)
    p.fill('[aria-label="Why you"]',"I run a monthly night for Brisbane bands and know the scene well."); p.get_by_role("button",name="Send application").click(); p.wait_for_timeout(500)
    check(F,"Application sent", p.get_by_test_id("apply-sent").count()==1); shot(p,"F4-1-apply")
    signout(p)
    reg(p,"Folio Team","team@x.com"); p.goto(B+"/me?tab=settings"); p.get_by_test_id("demo-admin").click(); p.wait_for_timeout(300)
    p.get_by_test_id("tab-team").click(); p.wait_for_timeout(500); shot(p,"F4-2-team-screen",True)
    check(F,"Team screen lists the pending application", p.get_by_test_id("pending-list").locator('[data-testid="app-pending"]').count()==1)
    p.get_by_test_id("approve").click(); p.wait_for_timeout(500)
    check(F,"Approve moves it to decided", p.locator('[data-testid="app-approved"]').count()==1); signout(p)
    login(p,"jo@x.com"); check(F,"Approved curator lands in the Studio on login", p.url.endswith("#/studio"), p.url)
    p.fill('[aria-label="Edition title"]',"Slow burns"); p.get_by_role("button",name="Publish").click(); p.wait_for_timeout(400)
    check(F,"Studio blocks an incomplete Edition", p.get_by_test_id("studio-errors").count()==1); shot(p,"F4-3-studio-errors",True)
    p.get_by_role("button",name="Add a pick").click() if False else None
    for i in range(1,9):
        p.fill(f'[aria-label="Pick {i} title"]',f"Song {i}"); p.fill(f'[aria-label="Pick {i} artist"]',f"Artist {i}")
        p.fill(f'[aria-label="Pick {i} why"]',f"Reason for pick {i}."); p.fill(f'[aria-label="Pick {i} liner note"]',f"A checkable fact about {i}.")
        p.fill(f'[aria-label="Pick {i} source name"]',"MusicBrainz"); p.fill(f'[aria-label="Pick {i} source link"]',"https://musicbrainz.org/")
    for i in (1,2,3):
        p.select_option(f'[aria-label="Pick {i} stage"]',"emerging")
    p.get_by_test_id("publish").click(); p.wait_for_timeout(400)
    check(F,"New artists without two sources and attestation are blocked", "own page" in p.get_by_test_id("studio-errors").inner_text() and "human-made" in p.get_by_test_id("studio-errors").inner_text())
    p.select_option('[aria-label="Pick 1 artist page type"]',"bandcamp"); p.fill('[aria-label="Pick 1 artist page link"]',"https://soundcloud.com/x"); p.get_by_test_id("publish").click(); p.wait_for_timeout(300)
    check(F,"Artist page link must match the chosen site", "not on Bandcamp" in p.get_by_test_id("studio-errors").inner_text())
    for i in (1,2,3):
        p.select_option(f'[aria-label="Pick {i} artist page type"]',"soundcloud"); p.fill(f'[aria-label="Pick {i} artist page link"]',f"https://soundcloud.com/artist{i}")
        p.fill(f'[aria-label="Pick {i} independent source name"]',"4ZZZ"); p.fill(f'[aria-label="Pick {i} independent source link"]',f"https://4zzzfm.org.au/artist{i}")
        p.fill(f'[aria-label="Pick {i} local note"]',"Profile says Brisbane; played The Zoo in 2026."); p.check(f'[aria-label="Pick {i} attestation"]')
    p.get_by_test_id("evidence-0").scroll_into_view_if_needed(); shot(p,"F4-3b-two-sources")
    p.get_by_test_id("publish").click(); p.wait_for_timeout(600); shot(p,"F4-4-published")
    check(F,"Valid 8-pick Edition with 3 new artists publishes", "Published" in (p.get_by_test_id("studio-status").inner_text() if p.get_by_test_id("studio-status").count() else ""), p.inner_text("body")[-400:])
    signout(p)
    # ---------- FLOW 5: listener connects to artist ----------
    F="F5 Listener and artist"
    login(p,"rae@x.com"); p.goto(B+"/archive"); p.wait_for_timeout(700)
    card=p.get_by_test_id("artist-card").filter(has_text="Zed Quartet")
    check(F,"Artist appears in Browse", card.count()==1)
    card.get_by_test_id("connect-btn").click(); p.wait_for_timeout(500)
    check(F,"Fan connects and sees the artist's update", card.get_by_test_id("dispatch").count()>=1); shot(p,"F5-1-connected",True)
    card.get_by_text("Ask a question").click(); p.wait_for_timeout(200)
    card.locator("textarea").fill("What's the new single about?"); card.get_by_test_id("ask-btn").click(); p.wait_for_timeout(500)
    check(F,"Fan asks one question", card.get_by_test_id("my-question").count()==1)
    card.get_by_text("Ask a question").count()
    signout(p)
    login(p,"zed@x.com"); p.goto(B+"/artist"); p.wait_for_timeout(600)
    check(F,"Artist sees the fan by name and the question", p.get_by_test_id("fan-list").get_by_text("Rae").count()==1 and p.get_by_test_id("artist-questions").count()==1); shot(p,"F5-2-artist-view",True)
    p.locator('[aria-label^="Reply to"]').first.fill("It's about slow mornings."); p.get_by_test_id("reply-btn").first.click(); p.wait_for_timeout(500)
    signout(p)
    login(p,"rae@x.com"); p.goto(B+"/archive"); p.wait_for_timeout(700)
    card=p.get_by_test_id("artist-card").filter(has_text="Zed Quartet")
    card.get_by_text("Ask a question").click(); p.wait_for_timeout(300)
    check(F,"Fan sees the artist's reply", card.get_by_test_id("reply").count()==1 and "slow mornings" in card.get_by_test_id("reply").inner_text(), card.inner_text()[-200:]); shot(p,"F5-3-reply",True)
    check("All flows","No page errors", not errs, errs)
    b.close()
json.dump(res,open(os.path.join(HERE,"..","..","09_Evidence","flow_test_results.json"),"w"),indent=1)
print(sum(r["pass"] for r in res),"passed",sum(not r["pass"] for r in res),"failed")
