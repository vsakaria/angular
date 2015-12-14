'use strict';var core_1 = require('angular2/core');
var animation_builder_1 = require('angular2/src/animate/animation_builder');
var animation_builder_mock_1 = require('angular2/src/mock/animation_builder_mock');
var proto_view_factory_1 = require('angular2/src/core/linker/proto_view_factory');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var change_detection_1 = require('angular2/src/core/change_detection/change_detection');
var exceptions_1 = require('angular2/src/facade/exceptions');
var pipe_resolver_1 = require('angular2/src/core/linker/pipe_resolver');
var xhr_1 = require('angular2/src/compiler/xhr');
var dom_adapter_1 = require('angular2/src/platform/dom/dom_adapter');
var directive_resolver_mock_1 = require('angular2/src/mock/directive_resolver_mock');
var view_resolver_mock_1 = require('angular2/src/mock/view_resolver_mock');
var mock_location_strategy_1 = require('angular2/src/mock/mock_location_strategy');
var location_strategy_1 = require('angular2/src/router/location_strategy');
var ng_zone_mock_1 = require('angular2/src/mock/ng_zone_mock');
var test_component_builder_1 = require('./test_component_builder');
var common_dom_1 = require('angular2/platform/common_dom');
var collection_1 = require('angular2/src/facade/collection');
var lang_1 = require('angular2/src/facade/lang');
var view_pool_1 = require('angular2/src/core/linker/view_pool');
var view_manager_utils_1 = require('angular2/src/core/linker/view_manager_utils');
var dom_tokens_1 = require('angular2/src/platform/dom/dom_tokens');
var dom_renderer_1 = require('angular2/src/platform/dom/dom_renderer');
var shared_styles_host_1 = require('angular2/src/platform/dom/shared_styles_host');
var shared_styles_host_2 = require('angular2/src/platform/dom/shared_styles_host');
var dom_events_1 = require('angular2/src/platform/dom/events/dom_events');
var serializer_1 = require("angular2/src/web_workers/shared/serializer");
var utils_1 = require('./utils');
var compiler_1 = require('angular2/src/compiler/compiler');
var dom_renderer_2 = require("angular2/src/platform/dom/dom_renderer");
var dynamic_component_loader_1 = require("angular2/src/core/linker/dynamic_component_loader");
var view_manager_1 = require("angular2/src/core/linker/view_manager");
/**
 * Returns the root injector providers.
 *
 * This must be kept in sync with the _rootBindings in application.js
 *
 * @returns {any[]}
 */
function _getRootProviders() {
    return [core_1.provide(reflection_1.Reflector, { useValue: reflection_1.reflector })];
}
/**
 * Returns the application injector providers.
 *
 * This must be kept in sync with _injectorBindings() in application.js
 *
 * @returns {any[]}
 */
function _getAppBindings() {
    var appDoc;
    // The document is only available in browser environment
    try {
        appDoc = dom_adapter_1.DOM.defaultDoc();
    }
    catch (e) {
        appDoc = null;
    }
    return [
        core_1.APPLICATION_COMMON_PROVIDERS,
        core_1.provide(change_detection_1.ChangeDetectorGenConfig, { useValue: new change_detection_1.ChangeDetectorGenConfig(true, false, true) }),
        core_1.provide(dom_tokens_1.DOCUMENT, { useValue: appDoc }),
        core_1.provide(dom_renderer_1.DomRenderer, { useClass: dom_renderer_2.DomRenderer_ }),
        core_1.provide(core_1.Renderer, { useExisting: dom_renderer_1.DomRenderer }),
        core_1.provide(core_1.APP_ID, { useValue: 'a' }),
        shared_styles_host_1.DomSharedStylesHost,
        core_1.provide(shared_styles_host_2.SharedStylesHost, { useExisting: shared_styles_host_1.DomSharedStylesHost }),
        view_pool_1.AppViewPool,
        core_1.provide(core_1.AppViewManager, { useClass: view_manager_1.AppViewManager_ }),
        view_manager_utils_1.AppViewManagerUtils,
        serializer_1.Serializer,
        common_dom_1.ELEMENT_PROBE_PROVIDERS,
        core_1.provide(view_pool_1.APP_VIEW_POOL_CAPACITY, { useValue: 500 }),
        proto_view_factory_1.ProtoViewFactory,
        core_1.provide(core_1.DirectiveResolver, { useClass: directive_resolver_mock_1.MockDirectiveResolver }),
        core_1.provide(core_1.ViewResolver, { useClass: view_resolver_mock_1.MockViewResolver }),
        core_1.provide(change_detection_1.IterableDiffers, { useValue: change_detection_1.defaultIterableDiffers }),
        core_1.provide(change_detection_1.KeyValueDiffers, { useValue: change_detection_1.defaultKeyValueDiffers }),
        utils_1.Log,
        core_1.provide(core_1.DynamicComponentLoader, { useClass: dynamic_component_loader_1.DynamicComponentLoader_ }),
        pipe_resolver_1.PipeResolver,
        core_1.provide(exceptions_1.ExceptionHandler, { useValue: new exceptions_1.ExceptionHandler(dom_adapter_1.DOM) }),
        core_1.provide(location_strategy_1.LocationStrategy, { useClass: mock_location_strategy_1.MockLocationStrategy }),
        core_1.provide(xhr_1.XHR, { useClass: dom_adapter_1.DOM.getXHR() }),
        test_component_builder_1.TestComponentBuilder,
        core_1.provide(core_1.NgZone, { useClass: ng_zone_mock_1.MockNgZone }),
        core_1.provide(animation_builder_1.AnimationBuilder, { useClass: animation_builder_mock_1.MockAnimationBuilder }),
        common_dom_1.EventManager,
        new core_1.Provider(common_dom_1.EVENT_MANAGER_PLUGINS, { useClass: dom_events_1.DomEventsPlugin, multi: true })
    ];
}
function _runtimeCompilerBindings() {
    return [
        core_1.provide(xhr_1.XHR, { useClass: dom_adapter_1.DOM.getXHR() }),
        compiler_1.COMPILER_PROVIDERS,
    ];
}
function createTestInjector(providers) {
    var rootInjector = core_1.Injector.resolveAndCreate(_getRootProviders());
    return rootInjector.resolveAndCreateChild(collection_1.ListWrapper.concat(_getAppBindings(), providers));
}
exports.createTestInjector = createTestInjector;
function createTestInjectorWithRuntimeCompiler(providers) {
    return createTestInjector(collection_1.ListWrapper.concat(_runtimeCompilerBindings(), providers));
}
exports.createTestInjectorWithRuntimeCompiler = createTestInjectorWithRuntimeCompiler;
/**
 * Allows injecting dependencies in `beforeEach()` and `it()`. When using with the
 * `angular2/testing` library, the test function will be run within a zone and will
 * automatically complete when all asynchronous tests have finished.
 *
 * Example:
 *
 * ```
 * beforeEach(inject([Dependency, AClass], (dep, object) => {
 *   // some code that uses `dep` and `object`
 *   // ...
 * }));
 *
 * it('...', inject([AClass], (object) => {
 *   object.doSomething().then(() => {
 *     expect(...);
 *   });
 * })
 * ```
 *
 * Notes:
 * - inject is currently a function because of some Traceur limitation the syntax should eventually
 *   becomes `it('...', @Inject (object: AClass, async: AsyncTestCompleter) => { ... });`
 *
 * @param {Array} tokens
 * @param {Function} fn
 * @return {FunctionWithParamTokens}
 */
function inject(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, false);
}
exports.inject = inject;
/**
 * @deprecated Use inject instead, which now supports both synchronous and asynchronous tests.
 */
function injectAsync(tokens, fn) {
    return new FunctionWithParamTokens(tokens, fn, true);
}
exports.injectAsync = injectAsync;
var FunctionWithParamTokens = (function () {
    function FunctionWithParamTokens(_tokens, _fn, isAsync) {
        this._tokens = _tokens;
        this._fn = _fn;
        this.isAsync = isAsync;
    }
    /**
     * Returns the value of the executed function.
     */
    FunctionWithParamTokens.prototype.execute = function (injector) {
        var params = this._tokens.map(function (t) { return injector.get(t); });
        return lang_1.FunctionWrapper.apply(this._fn, params);
    };
    FunctionWithParamTokens.prototype.hasToken = function (token) { return this._tokens.indexOf(token) > -1; };
    return FunctionWithParamTokens;
})();
exports.FunctionWithParamTokens = FunctionWithParamTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9pbmplY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy90ZXN0aW5nL3Rlc3RfaW5qZWN0b3IudHMiXSwibmFtZXMiOlsiX2dldFJvb3RQcm92aWRlcnMiLCJfZ2V0QXBwQmluZGluZ3MiLCJfcnVudGltZUNvbXBpbGVyQmluZGluZ3MiLCJjcmVhdGVUZXN0SW5qZWN0b3IiLCJjcmVhdGVUZXN0SW5qZWN0b3JXaXRoUnVudGltZUNvbXBpbGVyIiwiaW5qZWN0IiwiaW5qZWN0QXN5bmMiLCJGdW5jdGlvbldpdGhQYXJhbVRva2VucyIsIkZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLmNvbnN0cnVjdG9yIiwiRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMuZXhlY3V0ZSIsIkZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zLmhhc1Rva2VuIl0sIm1hcHBpbmdzIjoiQUFBQSxxQkFZTyxlQUFlLENBQUMsQ0FBQTtBQUN2QixrQ0FBK0Isd0NBQXdDLENBQUMsQ0FBQTtBQUN4RSx1Q0FBbUMsMENBQTBDLENBQUMsQ0FBQTtBQUU5RSxtQ0FBK0IsNkNBQTZDLENBQUMsQ0FBQTtBQUM3RSwyQkFBbUMseUNBQXlDLENBQUMsQ0FBQTtBQUM3RSxpQ0FNTyxxREFBcUQsQ0FBQyxDQUFBO0FBQzdELDJCQUErQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ2hFLDhCQUEyQix3Q0FBd0MsQ0FBQyxDQUFBO0FBQ3BFLG9CQUFrQiwyQkFBMkIsQ0FBQyxDQUFBO0FBRTlDLDRCQUFrQix1Q0FBdUMsQ0FBQyxDQUFBO0FBRTFELHdDQUFvQywyQ0FBMkMsQ0FBQyxDQUFBO0FBQ2hGLG1DQUErQixzQ0FBc0MsQ0FBQyxDQUFBO0FBQ3RFLHVDQUFtQywwQ0FBMEMsQ0FBQyxDQUFBO0FBQzlFLGtDQUErQix1Q0FBdUMsQ0FBQyxDQUFBO0FBQ3ZFLDZCQUF5QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBRTFELHVDQUFtQywwQkFBMEIsQ0FBQyxDQUFBO0FBRTlELDJCQUlPLDhC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Q0FBQ0EsVUFBQUEsQ0FBQ0EsSUFBSUEsT0FBQUEsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBZkEsQ0FBZUEsQ0FBQ0EsQ0FBQ0E7UUFDcERBLE1BQU1BLENBQUNBLHNCQUFlQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUNqREEsQ0FBQ0E7SUFFREYsMENBQVFBLEdBQVJBLFVBQVNBLEtBQVVBLElBQWFHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQzVFSCw4QkFBQ0E7QUFBREEsQ0FBQ0EsQUFaRCxJQVlDO0FBWlksK0JBQXVCLDBCQVluQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQVBQX0lELFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBBcHBWaWV3TWFuYWdlcixcbiAgRGlyZWN0aXZlUmVzb2x2ZXIsXG4gIER5bmFtaWNDb21wb25lbnRMb2FkZXIsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIFJlbmRlcmVyLFxuICBQcm92aWRlcixcbiAgVmlld1Jlc29sdmVyLFxuICBwcm92aWRlXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvYW5pbWF0ZS9hbmltYXRpb25fYnVpbGRlcic7XG5pbXBvcnQge01vY2tBbmltYXRpb25CdWlsZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvbW9jay9hbmltYXRpb25fYnVpbGRlcl9tb2NrJztcblxuaW1wb3J0IHtQcm90b1ZpZXdGYWN0b3J5fSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvcHJvdG9fdmlld19mYWN0b3J5JztcbmltcG9ydCB7UmVmbGVjdG9yLCByZWZsZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlZmxlY3Rpb24vcmVmbGVjdGlvbic7XG5pbXBvcnQge1xuICBJdGVyYWJsZURpZmZlcnMsXG4gIGRlZmF1bHRJdGVyYWJsZURpZmZlcnMsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgZGVmYXVsdEtleVZhbHVlRGlmZmVycyxcbiAgQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWdcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7RXhjZXB0aW9uSGFuZGxlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7UGlwZVJlc29sdmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvcGlwZV9yZXNvbHZlcic7XG5pbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3hocic7XG5cbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcblxuaW1wb3J0IHtNb2NrRGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL2RpcmVjdGl2ZV9yZXNvbHZlcl9tb2NrJztcbmltcG9ydCB7TW9ja1ZpZXdSZXNvbHZlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svdmlld19yZXNvbHZlcl9tb2NrJztcbmltcG9ydCB7TW9ja0xvY2F0aW9uU3RyYXRlZ3l9IGZyb20gJ2FuZ3VsYXIyL3NyYy9tb2NrL21vY2tfbG9jYXRpb25fc3RyYXRlZ3knO1xuaW1wb3J0IHtMb2NhdGlvblN0cmF0ZWd5fSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uX3N0cmF0ZWd5JztcbmltcG9ydCB7TW9ja05nWm9uZX0gZnJvbSAnYW5ndWxhcjIvc3JjL21vY2svbmdfem9uZV9tb2NrJztcblxuaW1wb3J0IHtUZXN0Q29tcG9uZW50QnVpbGRlcn0gZnJvbSAnLi90ZXN0X2NvbXBvbmVudF9idWlsZGVyJztcblxuaW1wb3J0IHtcbiAgRXZlbnRNYW5hZ2VyLFxuICBFVkVOVF9NQU5BR0VSX1BMVUdJTlMsXG4gIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTXG59IGZyb20gJ2FuZ3VsYXIyL3BsYXRmb3JtL2NvbW1vbl9kb20nO1xuXG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtGdW5jdGlvbldyYXBwZXIsIFR5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5cbmltcG9ydCB7QXBwVmlld1Bvb2wsIEFQUF9WSUVXX1BPT0xfQ0FQQUNJVFl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3Bvb2wnO1xuaW1wb3J0IHtBcHBWaWV3TWFuYWdlclV0aWxzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19tYW5hZ2VyX3V0aWxzJztcblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9kb21fdG9rZW5zJztcbmltcG9ydCB7RG9tUmVuZGVyZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3JlbmRlcmVyJztcbmltcG9ydCB7RG9tU2hhcmVkU3R5bGVzSG9zdH0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9zaGFyZWRfc3R5bGVzX2hvc3QnO1xuaW1wb3J0IHtTaGFyZWRTdHlsZXNIb3N0fSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL3NoYXJlZF9zdHlsZXNfaG9zdCc7XG5pbXBvcnQge0RvbUV2ZW50c1BsdWdpbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS9ldmVudHMvZG9tX2V2ZW50cyc7XG5cbmltcG9ydCB7U2VyaWFsaXplcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplclwiO1xuaW1wb3J0IHtMb2d9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtDT01QSUxFUl9QUk9WSURFUlN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9jb21waWxlcic7XG5pbXBvcnQge0RvbVJlbmRlcmVyX30gZnJvbSBcImFuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9kb20vZG9tX3JlbmRlcmVyXCI7XG5pbXBvcnQge0R5bmFtaWNDb21wb25lbnRMb2FkZXJffSBmcm9tIFwiYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2R5bmFtaWNfY29tcG9uZW50X2xvYWRlclwiO1xuaW1wb3J0IHtBcHBWaWV3TWFuYWdlcl99IGZyb20gXCJhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlld19tYW5hZ2VyXCI7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcm9vdCBpbmplY3RvciBwcm92aWRlcnMuXG4gKlxuICogVGhpcyBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBfcm9vdEJpbmRpbmdzIGluIGFwcGxpY2F0aW9uLmpzXG4gKlxuICogQHJldHVybnMge2FueVtdfVxuICovXG5mdW5jdGlvbiBfZ2V0Um9vdFByb3ZpZGVycygpIHtcbiAgcmV0dXJuIFtwcm92aWRlKFJlZmxlY3Rvciwge3VzZVZhbHVlOiByZWZsZWN0b3J9KV07XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYXBwbGljYXRpb24gaW5qZWN0b3IgcHJvdmlkZXJzLlxuICpcbiAqIFRoaXMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCBfaW5qZWN0b3JCaW5kaW5ncygpIGluIGFwcGxpY2F0aW9uLmpzXG4gKlxuICogQHJldHVybnMge2FueVtdfVxuICovXG5mdW5jdGlvbiBfZ2V0QXBwQmluZGluZ3MoKSB7XG4gIHZhciBhcHBEb2M7XG5cbiAgLy8gVGhlIGRvY3VtZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAgdHJ5IHtcbiAgICBhcHBEb2MgPSBET00uZGVmYXVsdERvYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYXBwRG9jID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgQVBQTElDQVRJT05fQ09NTU9OX1BST1ZJREVSUyxcbiAgICBwcm92aWRlKENoYW5nZURldGVjdG9yR2VuQ29uZmlnLCB7dXNlVmFsdWU6IG5ldyBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZyh0cnVlLCBmYWxzZSwgdHJ1ZSl9KSxcbiAgICBwcm92aWRlKERPQ1VNRU5ULCB7dXNlVmFsdWU6IGFwcERvY30pLFxuICAgIHByb3ZpZGUoRG9tUmVuZGVyZXIsIHt1c2VDbGFzczogRG9tUmVuZGVyZXJffSksXG4gICAgcHJvdmlkZShSZW5kZXJlciwge3VzZUV4aXN0aW5nOiBEb21SZW5kZXJlcn0pLFxuICAgIHByb3ZpZGUoQVBQX0lELCB7dXNlVmFsdWU6ICdhJ30pLFxuICAgIERvbVNoYXJlZFN0eWxlc0hvc3QsXG4gICAgcHJvdmlkZShTaGFyZWRTdHlsZXNIb3N0LCB7dXNlRXhpc3Rpbmc6IERvbVNoYXJlZFN0eWxlc0hvc3R9KSxcbiAgICBBcHBWaWV3UG9vbCxcbiAgICBwcm92aWRlKEFwcFZpZXdNYW5hZ2VyLCB7dXNlQ2xhc3M6IEFwcFZpZXdNYW5hZ2VyX30pLFxuICAgIEFwcFZpZXdNYW5hZ2VyVXRpbHMsXG4gICAgU2VyaWFsaXplcixcbiAgICBFTEVNRU5UX1BST0JFX1BST1ZJREVSUyxcbiAgICBwcm92aWRlKEFQUF9WSUVXX1BPT0xfQ0FQQUNJVFksIHt1c2VWYWx1ZTogNTAwfSksXG4gICAgUHJvdG9WaWV3RmFjdG9yeSxcbiAgICBwcm92aWRlKERpcmVjdGl2ZVJlc29sdmVyLCB7dXNlQ2xhc3M6IE1vY2tEaXJlY3RpdmVSZXNvbHZlcn0pLFxuICAgIHByb3ZpZGUoVmlld1Jlc29sdmVyLCB7dXNlQ2xhc3M6IE1vY2tWaWV3UmVzb2x2ZXJ9KSxcbiAgICBwcm92aWRlKEl0ZXJhYmxlRGlmZmVycywge3VzZVZhbHVlOiBkZWZhdWx0SXRlcmFibGVEaWZmZXJzfSksXG4gICAgcHJvdmlkZShLZXlWYWx1ZURpZmZlcnMsIHt1c2VWYWx1ZTogZGVmYXVsdEtleVZhbHVlRGlmZmVyc30pLFxuICAgIExvZyxcbiAgICBwcm92aWRlKER5bmFtaWNDb21wb25lbnRMb2FkZXIsIHt1c2VDbGFzczogRHluYW1pY0NvbXBvbmVudExvYWRlcl99KSxcbiAgICBQaXBlUmVzb2x2ZXIsXG4gICAgcHJvdmlkZShFeGNlcHRpb25IYW5kbGVyLCB7dXNlVmFsdWU6IG5ldyBFeGNlcHRpb25IYW5kbGVyKERPTSl9KSxcbiAgICBwcm92aWRlKExvY2F0aW9uU3RyYXRlZ3ksIHt1c2VDbGFzczogTW9ja0xvY2F0aW9uU3RyYXRlZ3l9KSxcbiAgICBwcm92aWRlKFhIUiwge3VzZUNsYXNzOiBET00uZ2V0WEhSKCl9KSxcbiAgICBUZXN0Q29tcG9uZW50QnVpbGRlcixcbiAgICBwcm92aWRlKE5nWm9uZSwge3VzZUNsYXNzOiBNb2NrTmdab25lfSksXG4gICAgcHJvdmlkZShBbmltYXRpb25CdWlsZGVyLCB7dXNlQ2xhc3M6IE1vY2tBbmltYXRpb25CdWlsZGVyfSksXG4gICAgRXZlbnRNYW5hZ2VyLFxuICAgIG5ldyBQcm92aWRlcihFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIHt1c2VDbGFzczogRG9tRXZlbnRzUGx1Z2luLCBtdWx0aTogdHJ1ZX0pXG4gIF07XG59XG5cbmZ1bmN0aW9uIF9ydW50aW1lQ29tcGlsZXJCaW5kaW5ncygpIHtcbiAgcmV0dXJuIFtcbiAgICBwcm92aWRlKFhIUiwge3VzZUNsYXNzOiBET00uZ2V0WEhSKCl9KSxcbiAgICBDT01QSUxFUl9QUk9WSURFUlMsXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZXN0SW5qZWN0b3IocHJvdmlkZXJzOiBBcnJheTxUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXT4pOiBJbmplY3RvciB7XG4gIHZhciByb290SW5qZWN0b3IgPSBJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKF9nZXRSb290UHJvdmlkZXJzKCkpO1xuICByZXR1cm4gcm9vdEluamVjdG9yLnJlc29sdmVBbmRDcmVhdGVDaGlsZChMaXN0V3JhcHBlci5jb25jYXQoX2dldEFwcEJpbmRpbmdzKCksIHByb3ZpZGVycykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVzdEluamVjdG9yV2l0aFJ1bnRpbWVDb21waWxlcihcbiAgICBwcm92aWRlcnM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPik6IEluamVjdG9yIHtcbiAgcmV0dXJuIGNyZWF0ZVRlc3RJbmplY3RvcihMaXN0V3JhcHBlci5jb25jYXQoX3J1bnRpbWVDb21waWxlckJpbmRpbmdzKCksIHByb3ZpZGVycykpO1xufVxuXG4vKipcbiAqIEFsbG93cyBpbmplY3RpbmcgZGVwZW5kZW5jaWVzIGluIGBiZWZvcmVFYWNoKClgIGFuZCBgaXQoKWAuIFdoZW4gdXNpbmcgd2l0aCB0aGVcbiAqIGBhbmd1bGFyMi90ZXN0aW5nYCBsaWJyYXJ5LCB0aGUgdGVzdCBmdW5jdGlvbiB3aWxsIGJlIHJ1biB3aXRoaW4gYSB6b25lIGFuZCB3aWxsXG4gKiBhdXRvbWF0aWNhbGx5IGNvbXBsZXRlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyB0ZXN0cyBoYXZlIGZpbmlzaGVkLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogYGBgXG4gKiBiZWZvcmVFYWNoKGluamVjdChbRGVwZW5kZW5jeSwgQUNsYXNzXSwgKGRlcCwgb2JqZWN0KSA9PiB7XG4gKiAgIC8vIHNvbWUgY29kZSB0aGF0IHVzZXMgYGRlcGAgYW5kIGBvYmplY3RgXG4gKiAgIC8vIC4uLlxuICogfSkpO1xuICpcbiAqIGl0KCcuLi4nLCBpbmplY3QoW0FDbGFzc10sIChvYmplY3QpID0+IHtcbiAqICAgb2JqZWN0LmRvU29tZXRoaW5nKCkudGhlbigoKSA9PiB7XG4gKiAgICAgZXhwZWN0KC4uLik7XG4gKiAgIH0pO1xuICogfSlcbiAqIGBgYFxuICpcbiAqIE5vdGVzOlxuICogLSBpbmplY3QgaXMgY3VycmVudGx5IGEgZnVuY3Rpb24gYmVjYXVzZSBvZiBzb21lIFRyYWNldXIgbGltaXRhdGlvbiB0aGUgc3ludGF4IHNob3VsZCBldmVudHVhbGx5XG4gKiAgIGJlY29tZXMgYGl0KCcuLi4nLCBASW5qZWN0IChvYmplY3Q6IEFDbGFzcywgYXN5bmM6IEFzeW5jVGVzdENvbXBsZXRlcikgPT4geyAuLi4gfSk7YFxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2Vuc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0Z1bmN0aW9uV2l0aFBhcmFtVG9rZW5zfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0KHRva2VuczogYW55W10sIGZuOiBGdW5jdGlvbik6IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbldpdGhQYXJhbVRva2Vucyh0b2tlbnMsIGZuLCBmYWxzZSk7XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGluamVjdCBpbnN0ZWFkLCB3aGljaCBub3cgc3VwcG9ydHMgYm90aCBzeW5jaHJvbm91cyBhbmQgYXN5bmNocm9ub3VzIHRlc3RzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0QXN5bmModG9rZW5zOiBhbnlbXSwgZm46IEZ1bmN0aW9uKTogRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uV2l0aFBhcmFtVG9rZW5zKHRva2VucywgZm4sIHRydWUpO1xufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25XaXRoUGFyYW1Ub2tlbnMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF90b2tlbnM6IGFueVtdLCBwcml2YXRlIF9mbjogRnVuY3Rpb24sIHB1YmxpYyBpc0FzeW5jOiBib29sZWFuKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZXhlY3V0ZWQgZnVuY3Rpb24uXG4gICAqL1xuICBleGVjdXRlKGluamVjdG9yOiBJbmplY3Rvcik6IGFueSB7XG4gICAgdmFyIHBhcmFtcyA9IHRoaXMuX3Rva2Vucy5tYXAodCA9PiBpbmplY3Rvci5nZXQodCkpO1xuICAgIHJldHVybiBGdW5jdGlvbldyYXBwZXIuYXBwbHkodGhpcy5fZm4sIHBhcmFtcyk7XG4gIH1cblxuICBoYXNUb2tlbih0b2tlbjogYW55KTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90b2tlbnMuaW5kZXhPZih0b2tlbikgPiAtMTsgfVxufVxuIl19