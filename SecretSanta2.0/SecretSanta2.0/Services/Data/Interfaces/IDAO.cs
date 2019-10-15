﻿using System.Threading.Tasks;

namespace SecretSanta2._0.Services.Data.Interfaces
{
	public interface IDAO<O, D>
	{
		Task<D> GetAll();
		Task<D> Get(string idx);
		Task<D> Add(O obj);
		Task<D> Update(string idx, O obj);
		Task<D> Delete(string idx);
	}
}