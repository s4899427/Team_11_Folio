# Intro checks: parts, tap, swipe, back, skip, replay from the Folio logo, ends on Today.
import sys
from playwright.sync_api import sync_playwright
B="http://localhost:4173/#"; ok=0; bad=0
def check(n,c,d=""):
    global ok,bad
    print(("PASS " if c else "FAIL ")+n+("" if c else "  :: "+str(d))); ok+=c; bad+=(not c)
with sync_playwright() as pw:
    b=pw.chromium.launch(); ctx=b.new_context(viewport={"width":390,"height":844},has_touch=True,timezone_id="Australia/Brisbane"); p=ctx.new_page()
    errs=[]; p.on("pageerror",lambda e:errs.append(str(e)))
    p.goto(B+"/"); p.wait_for_selector("[data-testid=welcome-0]")
    check("starts on part 1 (cover) with a date line", "front page" in p.inner_text("body").lower())
    # tap right side advances
    p.mouse.click(300,400); p.wait_for_timeout(300)
    check("tap right moves to part 2", p.get_by_test_id("welcome-1").count()==1)
    p.mouse.click(40,400); p.wait_for_timeout(300)
    check("tap left goes back", p.get_by_test_id("welcome-0").count()==1)
    # swipe left advances (touch events via dispatch)
    p.evaluate("""()=>{const el=document.querySelector('[data-testid^=welcome-]');const mk=(t,x)=>new TouchEvent(t,{touches:t==='touchend'?[]:[new Touch({identifier:1,target:el,clientX:x,clientY:400})],changedTouches:[new Touch({identifier:1,target:el,clientX:x,clientY:400})],bubbles:true});el.dispatchEvent(mk('touchstart',300));el.dispatchEvent(mk('touchend',120));}""")
    p.wait_for_timeout(300)
    check("swipe left moves forward", p.get_by_test_id("welcome-1").count()==1, p.url)
    p.evaluate("""()=>{const el=document.querySelector('[data-testid^=welcome-]');const mk=(t,x)=>new TouchEvent(t,{touches:t==='touchend'?[]:[new Touch({identifier:1,target:el,clientX:x,clientY:400})],changedTouches:[new Touch({identifier:1,target:el,clientX:x,clientY:400})],bubbles:true});el.dispatchEvent(mk('touchstart',120));el.dispatchEvent(mk('touchend',300));}""")
    p.wait_for_timeout(300)
    check("swipe right goes back", p.get_by_test_id("welcome-0").count()==1)
    p.keyboard.press("ArrowRight"); p.wait_for_timeout(200)
    check("arrow key works", p.get_by_test_id("welcome-1").count()==1)
    for _ in range(4): p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(250)
    check("last part is the city step", p.get_by_test_id("welcome-5").count()==1 and p.get_by_test_id("pick-brisbane").count()==1)
    if p.get_by_test_id("welcome-next").is_disabled(): p.get_by_test_id("pick-brisbane").click()
    p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(900)
    check("story ends on Today", p.url.endswith("#/") and p.get_by_test_id("item-card").count()>=5, p.url)
    # replay from the logo
    p.get_by_test_id("wordmark-replay").first.click(); p.wait_for_timeout(500)
    check("Folio logo replays the intro", "/welcome" in p.url and p.get_by_test_id("welcome-0").count()==1, p.url)
    p.get_by_test_id("welcome-skip").click(); p.wait_for_timeout(700)
    check("skip returns to Today", p.url.endswith("#/"), p.url)
    # Seoul: no Country part
    p.evaluate("localStorage.clear()"); p.goto(B+"/welcome"); p.reload(); p.wait_for_selector("[data-testid=welcome-0]")
    for _ in range(5): p.get_by_test_id("welcome-next").click(); p.wait_for_timeout(200)
    p.get_by_test_id("pick-seoul").click(); p.wait_for_timeout(300)
    check("picking another city on the last part keeps the flow valid", p.get_by_test_id("welcome-next").is_enabled() and "seoul" in p.get_by_test_id("welcome-next").inner_text().lower())
    check("no page errors", not errs, errs)
    b.close()
print(f"{ok} passed {bad} failed")
