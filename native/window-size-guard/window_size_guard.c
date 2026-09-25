#define UNICODE
#define _UNICODE
#define WIN32_LEAN_AND_MEAN
#define NOMINMAX

#include <limits.h>
#include <windows.h>
#include <commctrl.h>

static const wchar_t kMinimumWidthPropertyName[] =
    L"SHUO.Canvas.MinimumTrackWidth.v1";
static const wchar_t kMinimumHeightPropertyName[] =
    L"SHUO.Canvas.MinimumTrackHeight.v1";
static const wchar_t kSubclassInstalledPropertyName[] =
    L"SHUO.Canvas.MinimumTrackSubclassInstalled.v1";
static const wchar_t kRemoveSubclassMessageName[] =
    L"SHUO.Canvas.RemoveMinimumTrackSizeSubclass.v1";
static const UINT_PTR kMinimumSizeSubclassId = 0x5348554F;

static int ReadPositiveWindowProperty(
    HWND window,
    const wchar_t* propertyName) {
  const INT_PTR value = (INT_PTR)GetPropW(window, propertyName);
  if (value <= 0 || value > INT_MAX) return 0;
  return (int)value;
}

static UINT RemoveSubclassMessage(void) {
  static UINT message = 0;
  if (message == 0) {
    message = RegisterWindowMessageW(kRemoveSubclassMessageName);
  }
  return message;
}

static LRESULT CALLBACK MinimumSizeSubclassProc(
    HWND window,
    UINT message,
    WPARAM wParam,
    LPARAM lParam,
    UINT_PTR subclassId,
    DWORD_PTR referenceData) {
  (void)referenceData;
  if (message == WM_GETMINMAXINFO && lParam != 0) {
    const LRESULT result =
        DefSubclassProc(window, message, wParam, lParam);
    MINMAXINFO* minimums = (MINMAXINFO*)lParam;
    const int minimumWidth =
        ReadPositiveWindowProperty(window, kMinimumWidthPropertyName);
    const int minimumHeight =
        ReadPositiveWindowProperty(window, kMinimumHeightPropertyName);
    if (minimumWidth > minimums->ptMinTrackSize.x) {
      minimums->ptMinTrackSize.x = minimumWidth;
    }
    if (minimumHeight > minimums->ptMinTrackSize.y) {
      minimums->ptMinTrackSize.y = minimumHeight;
    }
    return result;
  }

  if (message == WM_NCDESTROY || message == RemoveSubclassMessage()) {
    RemoveWindowSubclass(window, MinimumSizeSubclassProc, subclassId);
    RemovePropW(window, kSubclassInstalledPropertyName);
  }
  return DefSubclassProc(window, message, wParam, lParam);
}

static void PinThisModule(void) {
  HMODULE module = NULL;
  GetModuleHandleExW(
      GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_PIN,
      (LPCWSTR)(const void*)&PinThisModule,
      &module);
}

static void InstallMinimumSizeSubclass(HWND window) {
  if (!window) return;
  if (ReadPositiveWindowProperty(window, kMinimumWidthPropertyName) <= 0 &&
      ReadPositiveWindowProperty(window, kMinimumHeightPropertyName) <= 0) {
    return;
  }

  if (GetPropW(window, kSubclassInstalledPropertyName) != NULL) return;

  PinThisModule();
  if (SetWindowSubclass(
          window,
          MinimumSizeSubclassProc,
          kMinimumSizeSubclassId,
          0)) {
    SetPropW(window, kSubclassInstalledPropertyName, (HANDLE)(INT_PTR)1);
  }
}

__declspec(dllexport) LRESULT CALLBACK ShuoCanvasCallWndProcHookProc(
    int hookCode,
    WPARAM wParam,
    LPARAM lParam) {
  if (hookCode >= 0 && lParam != 0) {
    const CWPSTRUCT* message = (const CWPSTRUCT*)lParam;
    InstallMinimumSizeSubclass(message->hwnd);
  }
  return CallNextHookEx(NULL, hookCode, wParam, lParam);
}

BOOL WINAPI DllMain(HINSTANCE instance, DWORD reason, LPVOID reserved) {
  (void)instance;
  (void)reason;
  (void)reserved;
  return TRUE;
}
