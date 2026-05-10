/**
 * admob.js — DataBulge AdMob Rewarded Video Integration
 * ─────────────────────────────────────────────────────
 * AdMob App ID:     ca-app-pub-9059847852972551~2189539471
 * AdMob Ad Unit ID: ca-app-pub-9059847852972551/7330185515
 *
 * Usage:
 *   1. Call initAdMob() once on app boot (after Capacitor is ready)
 *   2. Call loadRewardedAd() when user opens Earn tab (preloads silently)
 *   3. Call showRewardedAd(onRewarded, onSkipped, onFailed) when user taps Watch
 *
 * Works with @capacitor-community/admob
 * Install: npm install @capacitor-community/admob && npx cap sync android
 */

var DataBulgeAdMob = (function() {

  var AD_UNIT_ANDROID = 'ca-app-pub-9059847852972551/7330185515';
  var AD_UNIT_IOS     = 'REPLACE_WITH_IOS_AD_UNIT_ID_WHEN_READY';
  var IS_TESTING      = false; // Set true during development, false before publishing

  var _adLoaded    = false;
  var _adListeners = [];

  function getAdUnit() {
    if (typeof window.Capacitor === 'undefined') return AD_UNIT_ANDROID;
    var p = window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'android';
    return p === 'ios' ? AD_UNIT_IOS : AD_UNIT_ANDROID;
  }

  function getPlugin() {
    return window.Capacitor &&
           window.Capacitor.Plugins &&
           window.Capacitor.Plugins.AdMob || null;
  }

  /**
   * Initialize AdMob. Call once at app startup.
   */
  function initAdMob(cb) {
    var AdMob = getPlugin();
    if (!AdMob) { if (cb) cb('AdMob plugin not available'); return; }
    AdMob.initialize({
      testingDevices: [],          // Add your test device ID here during dev
      initializeForGeography: 1,   // 1 = worldwide
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false
    }).then(function() {
      if (cb) cb(null);
    }).catch(function(err) {
      if (cb) cb(err);
    });
  }

  /**
   * Preload a rewarded ad silently.
   * Call this when user opens the Earn tab so the ad is instant when they tap.
   */
  function loadRewardedAd(cb) {
    var AdMob = getPlugin();
    if (!AdMob) { _adLoaded = false; if (cb) cb('no_plugin'); return; }
    AdMob.prepareRewardVideoAd({
      adId: getAdUnit(),
      isTesting: IS_TESTING
    }).then(function() {
      _adLoaded = true;
      if (cb) cb(null);
    }).catch(function(err) {
      _adLoaded = false;
      if (cb) cb(err);
    });
  }

  /**
   * Show the rewarded ad.
   * @param onRewarded  function() — called when user completes ad and earns reward
   * @param onSkipped   function() — called when user skips/closes before completing
   * @param onFailed    function(err) — called when ad fails to show
   */
  function showRewardedAd(onRewarded, onSkipped, onFailed) {
    var AdMob = getPlugin();
    if (!AdMob) {
      if (onFailed) onFailed('AdMob plugin not available');
      return;
    }

    var rewarded    = false;
    var rewardedEvt = null;
    var dismissEvt  = null;
    var failedEvt   = null;

    function cleanup() {
      if (rewardedEvt && rewardedEvt.remove) rewardedEvt.remove();
      if (dismissEvt  && dismissEvt.remove)  dismissEvt.remove();
      if (failedEvt   && failedEvt.remove)   failedEvt.remove();
    }

    // Reward granted — user watched full ad
    if (AdMob.addListener) {
      rewardedEvt = AdMob.addListener('onRewardedVideoAdRewarded', function(reward) {
        rewarded = true;
        cleanup();
        if (onRewarded) onRewarded(reward);
      });

      // Ad dismissed
      dismissEvt = AdMob.addListener('onRewardedVideoAdClosed', function() {
        cleanup();
        if (!rewarded) {
          if (onSkipped) onSkipped();
        }
        // Preload next ad silently
        setTimeout(function() { loadRewardedAd(); }, 2000);
      });

      // Ad failed
      failedEvt = AdMob.addListener('onRewardedVideoAdFailedToLoad', function(err) {
        cleanup();
        _adLoaded = false;
        if (onFailed) onFailed(err);
      });
    }

    // Show the ad
    AdMob.showRewardVideoAd().then(function() {
      _adLoaded = false;
    }).catch(function(err) {
      cleanup();
      _adLoaded = false;
      if (onFailed) onFailed(err);
    });
  }

  return {
    init:   initAdMob,
    load:   loadRewardedAd,
    show:   showRewardedAd,
    isLoaded: function() { return _adLoaded; }
  };

})();

// Auto-init when Capacitor is ready
if (typeof window !== 'undefined') {
  if (typeof window.Capacitor !== 'undefined') {
    DataBulgeAdMob.init(function(err) {
      if (!err) DataBulgeAdMob.load();
    });
  } else {
    // Wait for Capacitor to load
    document.addEventListener('deviceready', function() {
      DataBulgeAdMob.init(function(err) {
        if (!err) DataBulgeAdMob.load();
      });
    });
  }
}
