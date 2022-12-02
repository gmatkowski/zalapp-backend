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
import { body, validationResult } from 'express-validator';
import UserRepository from "../../repositories/UserRepository.js";
import UserDto from "../../dto/UserDto.js";
import { AuthMiddleware, GuestMiddleware } from '../../middleware/index.js';
import bcrypt from "bcrypt";
import UserService from "../../servies/user/UserService.js";
import { JwtConfig } from "../../configs/index.js";
export default function (router) {
    var _this = this;
    var userRepository = new UserRepository();
    var userRepositoryRaw = new UserRepository([]);
    var userService = new UserService(JwtConfig.secret);
    router.post('/auth/register', GuestMiddleware, body('email').isEmail().custom(function (value) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userRepository.findByEmail(value !== null && value !== void 0 ? value : '')];
                case 1:
                    user = _a.sent();
                    if (user) {
                        throw new Error('This email address already exists');
                    }
                    return [2 /*return*/, true];
            }
        });
    }); }), body('password').isLength({ min: 3 }), body('password_confirmation').custom(function (value, _a) {
        var _b;
        var req = _a.req;
        if (!((_b = req.body) === null || _b === void 0 ? void 0 : _b.password) || value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }), body('first_name').isLength({ min: 3 }), body('last_name').isLength({ min: 3 }), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var errors, dto, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return [2 /*return*/, res
                                .status(422)
                                .json({ errors: errors.array() })];
                    }
                    dto = new UserDto(req.body.email);
                    dto.setFirstName(req.body.first_name);
                    dto.setLastName(req.body.last_name);
                    return [4 /*yield*/, userRepository.create(dto, req.body.password)];
                case 1:
                    user = _a.sent();
                    res
                        .status(201)
                        .json({
                        id: user.id
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    router.post('/auth/login', GuestMiddleware, body('email').isEmail().custom(function (value, _a) {
        var req = _a.req;
        return __awaiter(_this, void 0, void 0, function () {
            var user, password;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, userRepositoryRaw.findByEmail(value !== null && value !== void 0 ? value : '')];
                    case 1:
                        user = _b.sent();
                        password = req.body.password || null;
                        if (!user || !password || !bcrypt.compareSync(password, user.password)) {
                            throw new Error('Login incorrect');
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    }), body('password').isLength({ min: 3 }), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var errors, user, expireAt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return [2 /*return*/, res
                                .status(422)
                                .json({ errors: errors.array() })];
                    }
                    return [4 /*yield*/, userRepository.findByEmail(req.body.email)];
                case 1:
                    user = _a.sent();
                    expireAt = new Date();
                    expireAt.setHours(expireAt.getHours() + 2);
                    res.json({
                        token: userService.generateJwtTokenFromUser(user),
                        expireAt: expireAt
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    router.get('/auth/me', AuthMiddleware, function (req, res) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, res.json(req.user)];
    }); }); });
    router.delete('/user/:id', AuthMiddleware, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userRepository.find(parseInt(req.params.id))];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, res
                                .status(404)
                                .json({
                                message: 'NOT_FOUND'
                            })];
                    }
                    return [4 /*yield*/, userRepository.delete(user.id)];
                case 2:
                    _a.sent();
                    res.json();
                    return [2 /*return*/];
            }
        });
    }); });
    router.get('/user', AuthMiddleware, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var page, perPage, users, count;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    page = parseInt(((_a = req.params) === null || _a === void 0 ? void 0 : _a.page) || '1');
                    perPage = parseInt(((_b = req.params) === null || _b === void 0 ? void 0 : _b.perPage) || '10');
                    return [4 /*yield*/, userRepository.getListing(page, perPage)];
                case 1:
                    users = _c.sent();
                    return [4 /*yield*/, userRepository.count()];
                case 2:
                    count = _c.sent();
                    res.json({
                        data: users,
                        meta: {
                            total: count,
                            page: page,
                            perPage: perPage
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
