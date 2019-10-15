﻿using SecretSanta2._0.Enums;
using SecretSanta2._0.Models;
using SecretSanta2._0.Models.DB;
using SecretSanta2._0.Models.DTO;
using SecretSanta2._0.Services.Business.Interfaces;
using SecretSanta2._0.Services.Data.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SecretSanta2._0.Services.Business
{
	public class SantaService : ISantaService
	{
		private readonly IDAO<Participant, ParticipantDTO> _santaDAO;

		public SantaService(IDAO<Participant, ParticipantDTO> santaDAO)
		{
			this._santaDAO = santaDAO;
		}

		public async Task<PresentModel> GetSecretSanta(string participantName)
		{
			if (participantName.Equals("Please Select Your Name"))
			{
				return new PresentModel()
				{
					Title = "Oops!",
					PageDescription = "Looks like you forgot to select your name. Please return to the previous page and select your name from the dropdown before continuing.",
					Response = eResponse.Failure
				};
			}

			try
			{
				var participants = await _santaDAO.GetAll();

				if (participants.Data.Count() <= 1)
				{
					return new PresentModel()
					{
						Title = "Oops!",
						PageDescription = "Looks like you're the only one in the drawing pool. Make sure to come back soon to check and see if anyone else has joined the fun!",
						Response = eResponse.Failure
					};
				}

				var participant = participants.Data.FirstOrDefault(x => x.Name.Equals(participantName));

				if (participant == null)
				{
					return new PresentModel()
					{
						Title = "Oops!",
						PageDescription = "Looks like your name doesn't exist. Please return to the previous page and select a name from the dropdown.",
						Response = eResponse.Failure
					};
				}

				if (participant.HaveDrawn.Equals(1))
				{
					return new PresentModel()
					{
						Title = "Sorry, you have already drawn someone.",
						PageDescription = "If you can't remember who you drew, please text the system admin at (602) 810-3667.",
						Response = eResponse.Failure
					};
				}

				var availableParticipants = participants.Data.Where(x => x.Taken.Equals(0) && !x.Name.Equals(participantName));

				if (availableParticipants?.Count() > 0)
				{
					var secretSanta = availableParticipants.ElementAtOrDefault(new Random().Next(availableParticipants.Count()));

					if (secretSanta != null)
					{
						await _santaDAO.Update(
							secretSanta.Name,
							new Participant()
							{
								Id = secretSanta.Id,
								Name = secretSanta.Name,
								Taken = 1,
								HaveDrawn = secretSanta.HaveDrawn,
								WishList = secretSanta.WishList,
								WhoTheyDrew = secretSanta.WhoTheyDrew

							});
						await _santaDAO.Update(
							participant.Name,
							new Participant()
							{
								Id = participant.Id,
								Name = participant.Name,
								Taken = participant.Taken,
								HaveDrawn = 1,
								WishList = participant.WishList,
								WhoTheyDrew = secretSanta.Name

							});
						return new PresentModel()
						{
							Name = secretSanta.Name,
							WishList = secretSanta.WishList,
							Title = "Here is Your Secret Santa:",
							PageDescription = "Screenshot or print this page so that you don't forget! Have fun playing Santa and Merry Christmas!!!",
							HeaderOne = "You Got:",
							HeaderTwo = "Their Christmas Wishlist:",
							Response = eResponse.Success
						};
					}
				}

				return new PresentModel()
				{
					Title = "Sorry, all names have already been drawn.",
					PageDescription = "If this a mistake and you didn't get to draw someone, please text (602) 810-3667.",
					Response = eResponse.Failure
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<ParticipantsModel> GetParticipants()
		{
			try
			{
				var participants = await _santaDAO.GetAll();
				return new ParticipantsModel()
				{
					Participants = participants.Data.Select(x => x.Name)
				};
			}
			catch (Exception e)
			{
				throw e;
			}
		}

		public async Task<eResponse> JoinTheFun(InputModel user)
		{
			try
			{
				var participants = await _santaDAO.GetAll();
				if (!participants.Data.Any(x => x.Name.Equals(user.Name)))
				{
					await _santaDAO.Add(new Participant()
					{
						Name = user.Name,
						Taken = 0,
						HaveDrawn = 0,
						WishList = user.Wishlist
					});
					return eResponse.Success;
				}
				else
				{
					return eResponse.Failure;
				}
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}