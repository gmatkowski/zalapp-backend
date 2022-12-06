var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// @ts-ignore
import { PrismaClient } from '@prisma/client';
var AbstractRepository = /** @class */ (function () {
    function AbstractRepository(entity, excludeFunction, excludeFields) {
        if (excludeFunction === void 0) { excludeFunction = null; }
        if (excludeFields === void 0) { excludeFields = []; }
        this.excludeFields = [];
        this.client = new PrismaClient({
            log: ['query'],
        });
        this.entity = entity;
        this.excludeFunction = excludeFunction;
        this.excludeFields = excludeFields;
    }
    AbstractRepository.prototype.db = function () {
        return this.client[this.entity];
    };
    AbstractRepository.prototype.getListing = function (page, perPage) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, records;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = (page - 1) * perPage;
                        return [4 /*yield*/, this.db().findMany({
                                skip: offset,
                                take: perPage,
                                orderBy: [
                                    {
                                        id: 'desc'
                                    }
                                ]
                            })];
                    case 1:
                        records = _a.sent();
                        if (!this.excludeFunction) {
                            return [2 /*return*/, records];
                        }
                        return [2 /*return*/, records.map(function (record) {
                                return _this.excludeFunction ? _this.excludeFunction(record, _this.excludeFields) : record;
                            })];
                }
            });
        });
    };
    AbstractRepository.prototype.find = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db().findUnique({
                            where: {
                                id: id
                            }
                        })];
                    case 1:
                        record = _a.sent();
                        if (!record) {
                            return [2 /*return*/, null];
                        }
                        if (!this.excludeFunction) {
                            return [2 /*return*/, record];
                        }
                        return [2 /*return*/, this.excludeFunction(record, this.excludeFields)];
                }
            });
        });
    };
    AbstractRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db().delete({
                            where: {
                                id: id
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbstractRepository.prototype.count = function (query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db().count(query)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AbstractRepository;
}());
export default AbstractRepository;
