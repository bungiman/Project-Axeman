﻿/******************************************************************************
 * ResourceIndicator.js
 * 
 * Author:
 * 		Aleksandar Toplek
 *
 * Created on:
 * 		02.07.2012.
 *
 *****************************************************************************/

/// <summary>
/// Informs user about warehouse and granary 
/// overflow by showing time untill filled under
/// resources bar
/// </summary>
function ResourceIndicator() {

	/// <summary>
	/// Initializes object
	/// </summary>
	this.Register = function () {
		if (MatchPages([
			Enums.TravianPages.Home,
			Enums.TravianPages.Login,
			Enums.TravianPages.Logout])) return;

		Log("ResourcesIndicator: Registering ResourceIndicator plugin...");

		//Indicator beautifer
		$("#res").css({
			"background": "-webkit-linear-gradient(top, rgba(237, 237, 237, 0) 0%,rgba(224, 231, 241, 0.98) 50%)",
			"width": "589px",
			"border-bottom-left-radius": "10px",
			"border-bottom-right-radius": "10px",
			"box-shadow": "0px 1px 2px #888"
		});

		// Appends calculated time to page
		$("#res").children().each(function (index) {
			// Skips crop consumption
			if (index == 4)
				return true;
			var actualProduction = ActiveProfile.Villages[ActiveVillageIndex].Resources.Production[index];

			// Create element to append
			var element = $("<div><b><p>");
			$("p", element).addClass("ResourceIndicatorFillTime");
			$("p", element).css("text-align", "right");
			$("p", element).html("never");

			if (actualProduction == 0) {
				$(this).append(element);
			}
			else {
				var current = ActiveProfile.Villages[ActiveVillageIndex].Resources.Stored[index];
				var timeLeft = 0;
				if (actualProduction > 0) {
					var max = ActiveProfile.Villages[ActiveVillageIndex].Resources.Storage[index]
					timeLeft = (max - current) / actualProduction;
				}
				else {
					timeLeft = current / Math.abs(actualProduction);

					$("p", element).css("color", "red");
					$("p", element).addClass("negative");
				}
				$("p", element).attr("data-timeleft", timeLeft * 3600);
				$(this).append(element);
			}
			DLog("ResourcesIndicator: Appended to resource [l" + (index + 1) + "]");
		});

		// Initial refresh
		RefreshFunction();

		var interval = 1000;
		setInterval(RefreshFunction, interval);
		DLog("ResourcesIndicator: Timer registered to interval [" + interval + "]");

		if (!IsDevelopmentMode) {
			// Google analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-33221456-3']);
			_gaq.push(['_trackEvent', 'Plugin', 'Economy/ResourceIndicator']);

			(function () {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = 'https://ssl.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
	};

	/// <summary>
	/// Called in intervals to refresh times on elements
	/// </summary>
	/// <param name="cneg">Color for negative value</param>
	/// <param name="czero">Color for hours >= 3</param>
	/// <param name="calmost">Color for hours < 3</param>
	/// <param name="cclose">Color for hours < 0.75</param>
	/// <param name="cother">Color for hours = 0</param>
	function RefreshFunction(cneg, czero, calmost, cclose, cother) {
		$(".ResourceIndicatorFillTime").each(function () {
			// Get current time from element
			var secondsLeft = parseInt($(this).attr("data-timeleft"), 10);
			if (secondsLeft >= 0) {
				if (secondsLeft > 0) {
					secondsLeft--;
					$(this).attr("data-timeleft", secondsLeft);
				}
				$(this).html(ConvertSecondsToTime(secondsLeft));
			}

			if ($(this).hasClass("negative")) {
				$(this).css("color", cneg || "#C00");
			}
			else {
				// Changes element style (color) depending on current time state
				if (secondsLeft === 0)
					$(this).css("color", czero || "#C00");
				else if (secondsLeft < 2700)
					$(this).css("color", calmost || "#B20C08");
				else if (secondsLeft < 10800)
					$(this).css("color", cclose || "#A6781C");
				else $(this).css("color", cother || "#0C9E21");
			}
		});
	};
};

// Metadata for this plugin (ResourceIndicator)
var ResourceIndicatorMetadata = {
	Name: "ResourceIndicator",
	Alias: "Resource Indicator",
	Category: "Economy",
	Version: "0.2.1.0",
	Description: "Shows how long is needed for warehouse and granary to fill up to its maximum capacity and alerts accordingly.",
	Author: "JustBuild Development",
	Site: "https://github.com/JustBuild/Project-Axeman/wiki",

	Settings: {
		IsLoginRequired: true
	},

	Flags: {
		Beta: true
	},

	Class: ResourceIndicator
};

// Adds this plugin to global list of available plugins
GlobalPluginsList[GlobalPluginsList.length] = $.extend(true, {}, Models.PluginMetadata, ResourceIndicatorMetadata);