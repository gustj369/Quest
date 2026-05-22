# Add project specific ProGuard rules here.

# -----------------------------------------------------------------------
# Capacitor core — WebView bridge 보호
# -----------------------------------------------------------------------
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.annotation.PluginMethod <methods>;
}
-keepclassmembers class * extends com.getcapacitor.Plugin {
    public *;
}

# -----------------------------------------------------------------------
# AndroidX / AppCompat
# -----------------------------------------------------------------------
-keep class androidx.appcompat.** { *; }
-keep class androidx.core.** { *; }
-keep class androidx.coordinatorlayout.** { *; }

# -----------------------------------------------------------------------
# 디버깅을 위한 소스 위치 정보 보존
# -----------------------------------------------------------------------
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
