"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var nodemailer = require("nodemailer");

var pug = require("pug");

var htmlToText = require("html-to-text");

module.exports = /*#__PURE__*/function () {
  function Email(user, url) {
    (0, _classCallCheck2["default"])(this, Email);
    this.to = user.email;
    this.firstName = user.firstname;
    this.url = url;
    this.from = "Support at Hotels.ug <".concat(process.env.EMAIL_FROM, ">");
  }

  (0, _createClass2["default"])(Email, [{
    key: "newTransport",
    value: function newTransport() {
      // Create transporter
      if (process.env.NODE_ENV === "production") {
        return nodemailer.createTransport({
          service: "SendGrid",
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASS
          }
        });
      }

      return nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    } // send the real email

  }, {
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(template, subject) {
        var html, mailOptions;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Render HTML for the email
                html = pug.renderFile("".concat(__dirname, "/../views/email/").concat(template, ".pug"), {
                  firstName: this.firstName,
                  url: this.url,
                  subject: subject
                }); // Define email options

                mailOptions = {
                  from: this.from,
                  to: this.to,
                  subject: subject,
                  html: html,
                  text: htmlToText.fromString(html) //html:

                }; // Create a transport and send email

                _context.next = 4;
                return this.newTransport().sendMail(mailOptions);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x, _x2) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: "sendWelcome",
    value: function () {
      var _sendWelcome = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.send("welcome", "Welcome to Hotels.ug 😁");

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function sendWelcome() {
        return _sendWelcome.apply(this, arguments);
      }

      return sendWelcome;
    }()
  }, {
    key: "sendPasswordReset",
    value: function () {
      var _sendPasswordReset = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.send("passwordReset", "Your password reset token (Valid for only 10 minutes)");

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function sendPasswordReset() {
        return _sendPasswordReset.apply(this, arguments);
      }

      return sendPasswordReset;
    }()
  }]);
  return Email;
}();