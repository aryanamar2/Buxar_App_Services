#!/bin/bash
set -e

BUILD_DIR="/tmp/apk-build"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/res/mipmap-mdpi"
mkdir -p "$BUILD_DIR/res/mipmap-hdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xhdpi"
mkdir -p "$BUILD_DIR/res/mipmap-xxhdpi"
mkdir -p "$BUILD_DIR/src/com/buxar/homeservices"
mkdir -p "$BUILD_DIR/build/classes"
mkdir -p "$BUILD_DIR/build/gen"

# 1. AndroidManifest.xml
cat << 'EOF' > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.buxar.homeservices"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

# 2. Strings
cat << 'EOF' > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Buxar Home Services</string>
</resources>
EOF

# 3. Copy icons
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-mdpi/ic_launcher.png"
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-hdpi/ic_launcher.png"
cp public/pwa-192x192.png "$BUILD_DIR/res/mipmap-xhdpi/ic_launcher.png"
cp public/pwa-512x512.png "$BUILD_DIR/res/mipmap-xxhdpi/ic_launcher.png"

# 4. MainActivity.java
cat << 'EOF' > "$BUILD_DIR/src/com/buxar/homeservices/MainActivity.java"
package com.buxar.homeservices;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String APP_URL = "https://ais-dev-sg5blupkmuhx4bmyp7grru-654570558182.asia-southeast1.run.app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl(APP_URL);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

echo "--- 1. Running AAPT package resources ---"
aapt package -m \
    -J "$BUILD_DIR/build/gen" \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I /tmp/android.jar

echo "--- 2. Compiling Java sources with javac ---"
javac -encoding UTF-8 \
    -source 8 -target 8 \
    -cp /tmp/android.jar \
    -d "$BUILD_DIR/build/classes" \
    "$BUILD_DIR/build/gen/com/buxar/homeservices/R.java" \
    "$BUILD_DIR/src/com/buxar/homeservices/MainActivity.java"

echo "--- 3. Running D8 to convert bytecode to classes.dex ---"
java -cp /tmp/r8.jar com.android.tools.r8.D8 \
    --min-api 21 \
    --lib /tmp/android.jar \
    --output "$BUILD_DIR/build" \
    $(find "$BUILD_DIR/build/classes" -name "*.class")

echo "--- 4. Building initial APK package with AAPT ---"
aapt package -f \
    -M "$BUILD_DIR/AndroidManifest.xml" \
    -S "$BUILD_DIR/res" \
    -I /tmp/android.jar \
    -F "$BUILD_DIR/build/unaligned.apk"

echo "--- 5. Adding classes.dex to APK ---"
cd "$BUILD_DIR/build"
aapt add unaligned.apk classes.dex
cd -

echo "--- 6. Creating Release Keystore if needed ---"
KEYSTORE="/tmp/buxar.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkey -v \
        -keystore "$KEYSTORE" \
        -alias buxar \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass buxar123 \
        -keypass buxar123 \
        -dname "CN=BuxarHomeServices, OU=Services, O=BuxarApp, L=Buxar, ST=Bihar, C=IN"
fi

echo "--- 7. Aligning APK with zipalign ---"
zipalign -v -p 4 "$BUILD_DIR/build/unaligned.apk" "$BUILD_DIR/build/aligned.apk"

echo "--- 8. Signing APK with jarsigner ---"
jarsigner -verbose \
    -sigalg SHA256withRSA \
    -digestalg SHA-256 \
    -keystore "$KEYSTORE" \
    -storepass buxar123 \
    -keypass buxar123 \
    "$BUILD_DIR/build/aligned.apk" \
    buxar

echo "--- 9. Copying final APK to public/BuxarHomeServices.apk ---"
cp "$BUILD_DIR/build/aligned.apk" public/BuxarHomeServices.apk
ls -lh public/BuxarHomeServices.apk
echo "APK generation completed successfully!"
