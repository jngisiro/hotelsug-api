"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var mongoose = require("mongoose");

var validator = require("validator");

var bcrypt = require("bcryptjs");

var crypto = require("crypto");

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a first name"]
  },
  lastname: {
    type: String,
    required: [true, "Please provide a last name"]
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo: String,
  role: {
    type: String,
    "enum": ["user", "admin", "superadmin"],
    "default": "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false // Password field won't be selected in a user query

  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      // Custom validator only runs on Create() & Save()
      validator: function validator(el) {
        return el === this.password;
      },
      msg: "Passwords do not match"
    }
  },
  bookings: [{
    type: mongoose.Schema.ObjectId,
    ref: "Hotel"
  }],
  favourites: [{
    type: mongoose.Schema.ObjectId,
    ref: "Hotel"
  }],
  active: {
    type: Boolean,
    "default": true,
    select: false
  },
  accountActivated: {
    type: Boolean,
    "default": false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  // Created only when a user changes password
  passwordResetToken: String,
  passwordResetExpires: Date,
  confirmAccountToken: String,
  confirmAccountExpires: Date
}); // This function runs everytime a new document is created or saved in the database

userSchema.pre("save", /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (this.isModified("password")) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", next());

          case 2:
            _context.next = 4;
            return bcrypt.hash(this.password, 12);

          case 4:
            this.password = _context.sent;
            // Ignores / deletes the passwordconfirm field
            this.passwordConfirm = undefined; // Onto the next middleware

            next();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false
    }
  });
  next();
}); // userSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: "transactions",
//     select: "-__v"
//   });
//   next();
// });
// Embed transaction documents into the User document
// userSchema.pre("save", async function() {
//   const transactionPromises = this.transactions.map(
//     async id => await Transaction.findById(id)
//   );
//   this.transactions = await Promise.all(transactionPromises);
// });
// userSchema.pre(/^find/, async function(next) {
//   const transactions = await Transaction.find();
//   console.log(transactions);
//   this.transactions = transactions;
//   next();
// });
// userSchema.virtual("transactions", {
//   ref: "Transaction",
//   foreignField: "sender/_id",
//   localField: "_id"
// });
// Instance method for all user documents

userSchema.methods.correctPassword = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(candidatePassword, userPassword) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return bcrypt.compare(candidatePassword, userPassword);

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}(); // eslint-disable-next-line camelcase


userSchema.methods.changedPasswordAfterToken = function (JWT_timeStamp) {
  // Check if user has chnaged password
  if (this.passwordChangedAt) {
    var changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // eslint-disable-next-line camelcase

    return JWT_timeStamp < changedTimeStamp;
  } // False means password not changed after token was issued


  return false;
};

userSchema.methods.createToken = function (operation) {
  var token = crypto.randomBytes(32).toString("hex");

  if (operation === "confirmAccount") {
    this.confirmAccountToken = crypto.createHash("sha256").update(token).digest("hex");
    this.confirmAccountExpires = Date.now() + 60 * 60 * 1000;
  } else {
    this.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  }

  return token;
};

module.exports = mongoose.model("User", userSchema);